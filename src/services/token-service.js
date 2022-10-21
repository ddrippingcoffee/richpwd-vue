class TokenService {
    getLocalRefreshToken () {
        const user = this.getUser()
        return user?.refreshToken
    }

    getLocalAccessToken () {
        const user = this.getUser()
        return user?.token
    }

    updateLocalAccessToken (token) {
        let user = this.getUser()
        user.token = token
        localStorage.setItem('user', JSON.stringify(user))
    }

    getUser () {
        return JSON.parse(localStorage.getItem('user'))
    }

    setUser (user) {
        localStorage.setItem('user', JSON.stringify(user))
    }

    removeUser () {
        localStorage.removeItem('user')
    }
}

export default new TokenService()
