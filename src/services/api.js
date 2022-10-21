import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8085/richpwd',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default instance
