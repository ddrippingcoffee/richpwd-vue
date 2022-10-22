import api from './api'

class ComInfoService {
    getAll () {
        return api.get('/cominfo/')
    }

    save (com) {
        return api.post('/cominfo/', com)
    }

    updateCom (comSymb, com) {
        return api.put('/cominfo/' + comSymb + '/', com)
    }

    deleteCom (comSymb) {
        return api.delete('/cominfo/' + comSymb + '/')
    }
}

export default new ComInfoService()