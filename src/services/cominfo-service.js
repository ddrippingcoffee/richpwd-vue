import api from './api'

class ComInfoService {
    getAll () {
        return api.get('/cominfo/')
    }

    getComIndusList () {
        return api.get('/cominfo/r/induslist')
    }

    getByComIndusPage (indus, page) {
        let url = '/cominfo/s/indus/pg'
        // let url = '/cominfo/s/indus/sl'
        url += '?indus=' + indus
        url += '&page=' + page
        url += '&size=' + 10
        url += '&desc=' + 'desc'
        return api.get(url)
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