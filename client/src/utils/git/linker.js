import axios from 'axios'
import Node from '../tree/node'

class GitLinker {
  #_username
  #_repo
  #_baseURL

  constructor (username, repo) {
    this._username = username
    this._repo = repo
    this._baseURL = 'https://api.github.com'
  }

  get baseURL () { return this._baseURL }
  get branchesURL () { return (this._username && this._repo) ? `${this._baseURL}/repos/${this._username}/${this._repo}/branches` : undefined }
  get commitsURL () { return (this._username && this._repo) ? `${this._baseURL}/repos/${this._username}/${this._repo}/commits` : undefined }

  async getBranches () {
    const branches = []

    try {
      const response = await axios({
        url: this.branchesURL,
        method: 'get'
      })

      for (const obj of response.data) {
        branches.push({
          name: obj.name,
          latestCommit: {
            sha: obj.commit.sha,
            url: obj.commit.url
          }
        })
      }
    } catch (err) {
      console.error(err)
    }

    return branches
  }

  async getCommitsFromSHA (latestCommitSHA, pagination = 100) {
    try {
      const commits = []
      let response

      // Get the latest commit info
      response = await axios({
        url: `${this.commitsURL}/${latestCommitSHA}`,
        method: 'get'
      })

      commits.push({
        sha: response.data.sha,
        parents: response.data.parents,
        committer: {
          name: response.data.commit.committer.name,
          email: response.data.commit.committer.email
        },
        message: response.data.commit.message,
        date: response.data.commit.committer.date
      })

      // Get the rest of the commits info
      let isFinished = false
      let lastSavedSHA = latestCommitSHA

      while (!isFinished) {
        response = await axios({
          url: `${this.commitsURL}?sha=${lastSavedSHA}&per_page=${pagination}`,
          method: 'get'
        })

        for (let i = 1; i < response.data.length; ++i) {
          commits.push({
            sha: response.data[i].sha,
            parents: response.data[i].parents,
            committer: {
              name: response.data[i].commit.committer.name,
              email: response.data[i].commit.committer.email
            },
            message: response.data[i].commit.message,
            date: response.data[i].commit.committer.date
          })
        }

        lastSavedSHA = commits[commits.length - 1].sha

        if (response.data.length < pagination) {
          isFinished = true
        }
      }

      return commits
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async createTree (tree) {
    try {
      tree.clear()

      const createdSHASet = new Set()
      const branches = await this.getBranches()

      // Iterate branches and add their nodes
      for (let i = branches.length - 1; i >= 0; --i) {
        // Get all commits of current branch
        const commits = await this.getCommitsFromSHA(branches[i].latestCommit.sha)

        for (let j = commits.length - 1; j >= 0; --j) {
          const commit = commits[j]

          // Add the node if its not already added to the tree
          if (!createdSHASet.has(commit.sha)) {
            // Create new Node
            const node = new Node(commit.sha, tree.nodeDiameter)
            node.isPushed = true
            node.gitCommitInfo = {
              sha: commit.sha,
              committerName: commit.committer.name,
              committerEmail: commit.committer.email,
              commitMessage: commit.message,
              date: commit.date
            }
            node.endAnimation()

            // Add it to the tree
            if (commit.parents.length === 0) {
              // Root node
              tree.root = node
            } else {
              // Attach the newly created child node to its parent(s)
              for (const parent of commit.parents) {
                tree.addChildToNodeId(parent.sha, node)
              }
            }

            createdSHASet.add(commit.sha)
          }

          // First entry is the latest commit
          // This is where the branch head is located
          if (j === 0) {
            // Attach branch name to the node
            tree.addBranchToNodeId(commit.sha, branches[i].name)

            // Set current branch to be the master branch
            if (i === branches.length - 1) {
              tree.setCurrentBranch(branches[i].name)
            }
          }
        }
      }
    } catch (err) {
      console.error(err)
      tree.reset()
    }
  }
}

export default GitLinker
