import TokenService from "./TokenService"

const UserService = {
  getUser() {
    const payload = TokenService.getTokenPayload()
    if (!payload) {
      return {
        first_name: '',
        id: null,
        identifier: ''
      }
    }
    return {
      id: payload.id,
      first_name: payload.first_name,
      identifier: payload.identifier
    }
  }
}

export default UserService