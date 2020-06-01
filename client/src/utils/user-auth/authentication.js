import auth0 from 'auth0-js'
import decode from 'jwt-decode'

// Constants
const IDENTITY_CLIENT_ID = 'e6ee0e01-3be2-4dd5-6899-5f1bca740651'
const IDENTITY_CLIENT_DOMAIN = 'gitfiddle.identity.factset.io'
const SCOPE = 'openid profile email'
const CALLBACK_URL = `${window.location.protocol}//${window.location.host}/callback`

const AUTH_ID_TOKEN_KEY = 'id_token'

// WebAuth object that provides support for the authentication flows
const webAuth = new auth0.WebAuth({
  clientID: IDENTITY_CLIENT_ID,
  domain: IDENTITY_CLIENT_DOMAIN,
  callbackURL: CALLBACK_URL
})

// Getters and setters for ID token in local storage
const setIdToken = token => { localStorage.setItem(AUTH_ID_TOKEN_KEY, token) }
const getIdToken = () => localStorage.getItem(AUTH_ID_TOKEN_KEY)
const clearIdToken = () => { localStorage.removeItem(AUTH_ID_TOKEN_KEY) }

// Retreive the user metadata by decoding the id token
function getUserMeta () {
  const idToken = getIdToken()
  return (idToken ? decode(idToken) : undefined)
}

// Authenticate the user
function login () {
  // Make a get request at /authorize
  // Specify responseType to get back the tokens upon a successful response
  webAuth.authorize({
    responseType: 'token id_token',
    scope: SCOPE,
    redirectUri: CALLBACK_URL
  })
}

// Remove current user's metadata
function logout () {
  clearIdToken()
}

// Retreive the expiration date of the given token
function getTokenExpirationDate (encodedToken) {
  const token = decode(encodedToken)

  if (!token.exp) {
    return undefined
  }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)
  return date
}

// Check if the given token is expired or not
function isTokenExpired (encodedToken) {
  const expirationDate = getTokenExpirationDate(encodedToken)
  return (expirationDate === undefined || expirationDate < new Date())
}

// Check if the current user if logged in
function isLoggedIn () {
  const idToken = getIdToken()
  // User is logged in if id token is available and not expired
  return (!!idToken && !isTokenExpired(idToken))
}

export {
  webAuth,
  setIdToken,
  getIdToken,
  clearIdToken,
  getUserMeta,
  login,
  logout,
  getTokenExpirationDate,
  isTokenExpired,
  isLoggedIn
}
