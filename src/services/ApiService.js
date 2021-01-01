import config from '../config'

const ApiService = {
  login(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'login', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  },
  register(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'register', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  },
  getFingerprint(identifier) {
    const body = JSON.stringify({ identifier })
    return fetch(config.BASE_API_URL + `fingerprints`, { body, method: 'POST', headers: { 'content-type': 'application/json' } })
  },
  resetFingerprint(identifier) {
    const body = JSON.stringify({ identifier, action: 'reset' })
    return fetch(config.BASE_API_URL + `fingerprints`, { body, method: 'PUT', headers: { 'content-type': 'application/json' } })
  },
  incrementUsage(identifier) {
    const body = JSON.stringify({ identifier, action: 'increment' })
    return fetch(config.BASE_API_URL + `fingerprints`, { body, method: 'PUT', headers: { 'content-type': 'application/json' } })
  }
}

export default ApiService