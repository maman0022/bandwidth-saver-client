import config from '../config'

const ApiService = {
  login(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'login', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  },
  register(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'register', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  }
}

export default ApiService