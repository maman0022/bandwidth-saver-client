const TokenService = {
  saveToken(token) {
    window.localStorage.setItem('user', token)
  },
  getToken() {
    return window.localStorage.getItem('user')
  },
  clearToken() {
    window.localStorage.removeItem('user')
  },
  getTokenPayload() {
    const token = this.getToken() || ''
    if (!token) {
      return null
    }
    let payload = token.split('.')[1]
    payload = atob(payload)
    return JSON.parse(payload)
  },
  verifyToken() {
    try {
      const payload = this.getTokenPayload()
      return payload.exp >= Date.now() / 1000
    } catch (error) {
      return false
    }
  }
}

export default TokenService