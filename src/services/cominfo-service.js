import api from './api'

class ComInfoService {
    getAll () {
        return api.get('/cominfo/')
    }

    save (com) {
        return api.post('/cominfo/', com)
    }

    // deleteCom (comSymb) {
    //     return api.delete('/cominfo/' + comSymb + '/')
    // }
}

export default new ComInfoService()