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

    getByComTypePage (params) {
        let url = '/cominfo/s/type/pg'
        url += '?type=' + params.type
        url += '&page=' + params.page
        url += '&size=' + params.size
        url += '&desc=' + params.desc
        return api.get(url)
    }

    getByComCotedPage (params) {
        let url = '/cominfo/s/coted/pg'
        url += '?coted=' + params.coted
        url += '&page=' + params.page
        url += '&size=' + params.size
        url += '&desc=' + params.desc
        return api.get(url)
    }
}

export default new ComInfoService()