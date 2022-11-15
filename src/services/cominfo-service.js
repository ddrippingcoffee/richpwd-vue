import api from './api'

class ComInfoService {
    getAll () {
        return api.get('/cominfo/')
    }

    getComIndusList () {
        return api.get('/cominfo/r/induslist')
    }

    getBySymbPage (symb, page) {
        let url = '/cominfo/s/pg/symb'
        url += '?symb=' + symb
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getByComNmSlice (comNm, page) {
        let url = '/cominfo/s/sl/nm'
        url += '?comNm=' + comNm
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getByComMainPage (comMain, page) {
        let url = '/cominfo/s/pg/main'
        url += '?comMain=' + comMain
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getByComCotedPage (comCoted, page) {
        let url = '/cominfo/s/pg/coted'
        url += '?comCoted=' + comCoted
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getByComCepPage (comCep, page) {
        let url = '/cominfo/s/pg/cep'
        url += '?comCep=' + comCep
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getByComIndusPage (indus, page) {
        let url = '/cominfo/s/pg/indus'
        url += '?indus=' + indus
        url += '&page=' + page
        url += '&size=' + 8
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    save (com) {
        return api.post('/cominfo/', com)
    }

    updateCom (comSymb, com) {
        return api.put('/cominfo/' + comSymb + '/', com)
    }

    updateCurrCom (com) {
        return api.put('/cominfo/' + com.symb + '/', com)
    }

    deleteCom (comSymb) {
        return api.delete('/cominfo/' + comSymb + '/')
    }
}

export default new ComInfoService()