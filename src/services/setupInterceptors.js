import axiosInstance from './api'
import TokenService from './token-service'

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if ('/auth/signin' !== config.url &&
                '/auth/signup' !== config.url &&
                '/auth/refreshtoken' !== config.url &&
                '/test/all' !== config.url) {

                const token = TokenService.getLocalAccessToken()
                if (token) {
                    // for Spring Boot back-end
                    config.headers['Authorization'] = 'Bearer ' + token
                    // for Node.js Express back-end
                    // config.headers["x-access-token"] = token;
                }
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (res) => {
            return res
        },
        async (err) => {
            const originalConfig = err.config

            if ('/auth/signin' !== originalConfig.url &&
                '/auth/signup' !== originalConfig.url &&
                '/auth/refreshtoken' !== originalConfig.url &&
                '/test/all' !== originalConfig.url &&
                err.response) {

                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true

                    try {
                        const rs = await axiosInstance.post('/auth/refreshtoken', {
                            refreshToken: TokenService.getLocalRefreshToken(),
                        })
                        const { accessToken } = rs.data
                        store.dispatch('auth/refreshToken', accessToken)

                        TokenService.updateLocalAccessToken(accessToken)
                        return axiosInstance(originalConfig)
                    } catch (_error) {
                        return Promise.reject(_error)
                    }
                }
            }
            return Promise.reject(err)
        }
    )
}

export default setup