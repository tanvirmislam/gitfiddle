import Node from './node'

class Tree {
    #_nextId;
    #_nodeDiameter;
    #_animationSpeed;
    #_root;
    #_currentBranchName;
    #_currentBranchNode;
    #_nodeSet;
    #_idToNodeDict;
    #_branchNameToNodeDict;
    #_info;
    #_formatter;

    constructor (treeFormatter) {
      this._init()
      this._formatter = treeFormatter
      this._formatter.margin = this._nodeDiameter
      this._buildPreviewTree()
    }

    _init () {
      this._nextId = 0
      this._nodeDiameter = 35
      this._animationSpeed = 35

      this._root = undefined
      this._currentBranchName = undefined
      this._currentBranchNode = undefined
      this._nodeSet = new Set()
      this._idToNodeDict = {}
      this._branchNameToNodeDict = {}
      this._info = {
        totalNodes: 0,
        width: 0,
        height: 0,
        levelOrder: []
      }
    }

    set root (node) {
      this._root = node

      this._currentBranchName = 'master'
      this._currentBranchNode = node

      this._nodeSet.add(node)

      this._idToNodeDict[node.id] = node

      for (let i = 0; i < node.branchNames.length; ++i) {
        this._branchNameToNodeDict[node.branchNames[i]] = node
      }

      this.updateTreeInfo()
      this.adjust()
    }

    set animationSpeed (spd) { this._animationSpeed = spd }
    set nodeDiameter (d) { this._nodeDiameter = d }

    get nextId () { return ++this._nextId }
    get nodeDiameter () { return this._nodeDiameter }
    get animationSpeed () { return this._animationSpeed }
    get root () { return this._root }
    get nodeSet () { return this._nodeSet }
    get branchNameToNodeDict () { return this._branchNameToNodeDict }
    get info () { return this._info }
    get currentBranchName () { return this._currentBranchName }
    get currentBranchNode () { return this._branchNameToNodeDict[this._currentBranchName] }
    get formatter () { return this._formatter }

    getNodeFromId (nodeId) {
      return this._idToNodeDict[nodeId]
    }

    getNodeFromBranchName (branchName) {
      return this._branchNameToNodeDict[branchName]
    }

    doesBranchExist (branchName) {
      return (this._branchNameToNodeDict[branchName] !== undefined)
    }

    isAnimated () {
      let status = false
      this._nodeSet.forEach((n) => {
        status = status || n.isAnimated
      })
      return status
    }

    addBranchToNode (node, branchName) {
      if (node !== undefined) {
        node.addBranch(branchName)
        this._branchNameToNodeDict[branchName] = node
      }
    }

    addBranchToNodeId (nodeId, branchName) {
      const node = this._idToNodeDict[nodeId]
      this.addBranchToNode(node, branchName)
    }

    removeBranchFromNode (node, branchName) {
      if (node !== undefined) {
        node.removeBranch(branchName)
        delete this._branchNameToNodeDict[branchName]

        if (branchName === this._currentBranchName) {
          this._currentBranchName = undefined
          this._currentBranchNode = undefined
        }
      }
    }

    removeBranchFromNodeId (nodeId, branchName) {
      const node = this._idToNodeDict[nodeId]
      this.removeBranchFromNode(node, branchName)
    }

    setCurrentBranch (branchName) {
      if (this._branchNameToNodeDict[branchName] !== undefined) {
        this._currentBranchName = branchName
        this._currentBranchNode = this._branchNameToNodeDict[branchName]
      }
    }

    switchBranch (branchName, fromNode, toNode) {
      fromNode.branchNames.splice(fromNode.branchNames.indexOf(branchName), 1)
      toNode.branchNames.push(branchName)
      this._branchNameToNodeDict[branchName] = toNode

      if (branchName === this._currentBranchName) {
        this._currentBranchNode = toNode
      }
    }

    attachExistingBranchToNode (branchName, node) {
      if (node !== undefined) {
        node.addBranch(branchName)
        this._branchNameToNodeDict[branchName] = node

        if (this._currentBranchName === branchName) {
          this._currentBranchNode = node
        }
      }
    }

    attachExistingBranchToNodeId (branchName, nodeId) {
      const node = this._idToNodeDict[nodeId]
      this.attachExistingBranchToNode(branchName, node)
    }

    addChildToNode (parentNode, childNode) {
      if (parentNode === undefined || !this._nodeSet.has(parentNode)) {
        console.log('Tree::addChildToNode error: parent node does not exist')
        return
      }

      parentNode.addChild(childNode)
      childNode.addParent(parentNode)

      this._nodeSet.add(childNode)

      this._idToNodeDict[childNode.id] = childNode

      for (let i = 0; i < childNode.branchNames.length; ++i) {
        this._branchNameToNodeDict[childNode.branchNames[i]] = childNode
      }

      this.updateTreeInfo()
      this.adjust()
    }

    addChildToNodeId (parentId, childNode) {
      const parentNode = this._idToNodeDict[parentId]
      this.addChildToNode(parentNode, childNode)
    }

    addChildToBranchName (parentBranchName, childNode) {
      const parentNode = this._branchNameToNodeDict[parentBranchName]
      this.addChildToNode(parentNode, childNode)
    }

    remove (node) {
      const parents = node.parents

      for (let i = 0; i < parents.length; ++i) {
        const childIndex = parents[i].children.findIndex(n => n.id === node.id)
        parents[i].children.splice(childIndex, 1)
      }

      delete this._idToNodeDict[node.id]

      this._nodeSet.forEach((n) => {
        if (n.id === node.id) {
          this._nodeSet.delete(n)
        }
      })
    }

    markNodeForDeletion (node) {
      if (node === undefined) {
        return
      }
      node.isAnimated = true
      node.isBeingCreated = false
    }

    markNodeIdForDeletion (nodeId) {
      const node = this._idToNodeDict[nodeId]
      this.markNodeForDeletion(node)
    }

    areAnyNodesMarkedForDeletion () {
      let status = false
      this._nodeSet.forEach((n) => {
        status = status || (n.isAnimated && !n.isBeingCreated)
      })
      return status
    }

    getLCAInfo (currentNode, rebaseNode) {
      // Least common ancestor of the two given nodes
      // Used in the rebase command
      // Can be optimized
      const currentNodePathsToRoot = this.getPathsToNode(currentNode, this._root)
      const rebaseNodePathsToRoot = this.getPathsToNode(rebaseNode, this._root)
      let lcaNode

      for (let i = 0; i < currentNodePathsToRoot.length; ++i) {
        for (let j = 0; j < rebaseNodePathsToRoot.length; ++j) {
          lcaNode = this._getLCANodeFromPathsToRoot(currentNodePathsToRoot[i], rebaseNodePathsToRoot[j])
          if (lcaNode !== undefined) {
            return {
              currentNodePathsToRoot: currentNodePathsToRoot,
              rebaseNodePathsToRoot: rebaseNodePathsToRoot,
              lcaNode: lcaNode
            }
          }
        }
      }

      return {
        currentNodePathsToRoot: currentNodePathsToRoot,
        rebaseNodePathsToRoot: rebaseNodePathsToRoot,
        lcaNode: undefined
      }
    }

    getPathsToNode (startNode, endNode) {
      const allPaths = []
      this._recurseToGetPathsToRoot(startNode, endNode, [], allPaths)
      return allPaths
    }

    _recurseToGetPathsToRoot (startNode, endNode, currentPath, allPaths) {
      currentPath.push(startNode)

      if (startNode === endNode) {
        allPaths.push(currentPath)
        return
      }

      const currentPathSnapshot = []
      for (let i = 0; i < currentPath.length; ++i) {
        currentPathSnapshot.push(currentPath[i])
      }

      for (let i = 0; i < startNode.parents.length; ++i) {
        if (i === 0) {
          this._recurseToGetPathsToRoot(startNode.parents[i], endNode, currentPath, allPaths)
        } else {
          const clonedCurrentPath = []
          for (let i = 0; i < currentPathSnapshot.length; ++i) {
            clonedCurrentPath.push(currentPathSnapshot[i])
          }
          this._recurseToGetPathsToRoot(startNode.parents[i], endNode, clonedCurrentPath, allPaths)
        }
      }
    }

    _getLCANodeFromPathsToRoot (nodeXPathToRoot, nodeYPathToRoot) {
      const s = new Set(nodeXPathToRoot)
      for (let i = 0; i < nodeYPathToRoot.length; ++i) {
        if (s.has(nodeYPathToRoot[i])) {
          return nodeYPathToRoot[i]
        }
      }
      return undefined
    }

    getNodeCountTillAncestor (descendentNode, ancestorNode) {
      // Total number of ancestor nodes
      // Used in the rebase command
      const paths = this.getPathsToNode(descendentNode, ancestorNode)
      const s = new Set()

      for (let i = 0; i < paths.length; ++i) {
        for (let j = 0; j < paths[i].length; ++j) {
          if (paths[i][j] !== ancestorNode && s.has(paths[i][j]) === false) {
            s.add(paths[i][j])
          }
        }
      }

      return s.size
    }

    getBranchSpecificPath (branchName) {
      // A path that starts from an ancestor node and
      // doesn't include any other branches other than the given branch
      // Used in the rebase command
      const node = this._branchNameToNodeDict[branchName]
      const pathSet = new Set()

      this._recurseToGetBranchSpecificPath(branchName, node, pathSet)
      return Array.from(pathSet)
    }

    _recurseToGetBranchSpecificPath (branchName, currentNode, pathSet) {
      if (currentNode === this._root) {
        return pathSet
      }

      if (currentNode.children.length === 0) {
        if (currentNode.branchNames.length === 1 && currentNode.branchNames[0] === branchName) {
          pathSet.add(currentNode)
        } else {
          return pathSet
        }
      } else if (currentNode.children.length === 1) {
        if (currentNode.branchNames.length === 0 && pathSet.has(currentNode.children[0])) {
          pathSet.add(currentNode)
        } else {
          return pathSet
        }
      } else {
        return pathSet
      }

      for (let i = 0; i < currentNode.parents.length; ++i) {
        this._recurseToGetBranchSpecificPath(branchName, currentNode.parents[i], pathSet)
      }

      return pathSet
    }

    reset () {
      this._init()
      this._animationSpeed = 10

      const rootNode = new Node(this.nextId, this.nodeDiameter)
      rootNode.addBranch('master')
      this.root = rootNode
    }

    adjust () {
      this._formatter.adjustTree(this)
    }

    updateTreeInfo () {
      if (!this._root) {
        return
      }

      this._info.totalNodes = 0
      this._info.width = 0
      this._info.height = 0
      this._info.levelOrder = []

      const currentLevel = []
      let nextLevel = []

      nextLevel.push(this._root)

      while (currentLevel.length !== 0 || nextLevel.length !== 0) {
        if (currentLevel.length === 0) {
          this._info.totalNodes += nextLevel.length
          this._info.width = Math.max(this._info.width, nextLevel.length)
          this._info.height += 1

          this._info.levelOrder.push(nextLevel)

          currentLevel.push(...nextLevel)
          nextLevel = []
        } else {
          const node = currentLevel.shift()
          nextLevel.push(...(node.children))
        }
      }
    }

    getTreeInfoStr () {
      let str = '\n------------------------\n=== Tree Information ===\n------------------------\n'

      str += `Total Nodes: ${this._info.totalNodes}\nWidth: ${this._info.width}\nHeight: ${this._info.height}\n`
      str += 'Level Order Traversal:\n'

      let lvl = ''
      for (let i = 0; i < this._info.levelOrder.length; ++i) {
        for (let j = 0; j < this._info.levelOrder[i].length; ++j) {
          lvl += this._info.levelOrder[i][j].id + ' '
        }
        str += lvl + '\n'
        lvl = ''
      }

      str += '------------------------\n'

      return str
    }

    _buildPreviewTree () {
      const n1 = new Node('1', this._nodeDiameter)
      const n2 = new Node('2', this._nodeDiameter)
      const n3 = new Node('3', this._nodeDiameter)
      const n4 = new Node('4', this._nodeDiameter)
      const n5 = new Node('5', this._nodeDiameter)
      const n6 = new Node('6', this._nodeDiameter)
      const n7 = new Node('7', this._nodeDiameter)
      const n8 = new Node('8', this._nodeDiameter)
      const n9 = new Node('9', this._nodeDiameter)
      const n10 = new Node('10', this._nodeDiameter)
      const n11 = new Node('11', this._nodeDiameter)
      const n12 = new Node('12', this._nodeDiameter)
      const n13 = new Node('13', this._nodeDiameter)
      const n14 = new Node('14', this._nodeDiameter)
      const n15 = new Node('15', this._nodeDiameter)
      const n16 = new Node('16', this._nodeDiameter)
      const n17 = new Node('17', this._nodeDiameter)
      const n18 = new Node('18', this._nodeDiameter)

      this.root = n1

      this.addChildToNodeId('1', n2)
      this.addChildToNodeId('1', n3)

      this.addChildToNodeId('2', n4)
      this.addChildToNodeId('2', n5)
      this.addChildToNodeId('3', n6)
      this.addChildToNodeId('3', n7)
      this.addChildToNodeId('3', n8)
      this.addChildToNodeId('3', n9)

      this.addChildToNodeId('4', n10)
      this.addChildToNodeId('7', n11)
      this.addChildToNodeId('7', n12)
      this.addChildToNodeId('9', n13)

      this.addChildToNodeId('10', n14)
      this.addChildToNodeId('12', n15)
      this.addChildToNodeId('13', n16)

      this.addChildToNodeId('15', n17)

      this.addChildToNodeId('17', n18)

      this.getNodeFromId('10').addParent(this.getNodeFromId('5'))
      this.getNodeFromId('15').addParent(this.getNodeFromId('11'))
      this.getNodeFromId('16').addParent(this.getNodeFromId('8'))
      this.getNodeFromId('17').addParent(this.getNodeFromId('16'))
      this.getNodeFromId('18').addParent(this.getNodeFromId('14'))

      this._nodeSet.forEach((n) => {
        n.isPushed = true
      })
    }
}

export default Tree
