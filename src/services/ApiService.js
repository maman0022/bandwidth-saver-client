import config from '../config'
import TokenService from "./TokenService"

const ApiService = {
  login(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'login', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  },
  register(userData) {
    const body = JSON.stringify(userData)
    return fetch(config.BASE_API_URL + 'register', { method: 'POST', headers: { 'content-type': 'application/json' }, body })
  },
  getDrives() {
    return fetch(config.BASE_API_URL + `drives`, { headers: { 'authorization': `bearer ${TokenService.getToken()}` } })
  }
}

export default ApiService