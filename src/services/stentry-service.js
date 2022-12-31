import api from './api'

class StEntryService {

    save (stEntry) {
        return api.post('/entry/stores', stEntry)
    }

    getTotalEntryPage (page) {
        let url = '/entry/s/pg/tot'
        url += '?page=' + page
        url += '&size=' + 8
        return api.get(url)
    }

    getTotalEntryBySymbSlice (symb, page) {
        let url = '/entry/s/pg/tot/symb'
        url += '?symb=' + symb
        url += '&page=' + page
        url += '&size=' + 8
        return api.get(url)
    }

    getTotalEntryByComNmSlice (comNm, page) {
        let url = '/entry/s/pg/tot/comNm'
        url += '?comNm=' + comNm
        url += '&page=' + page
        url += '&size=' + 8
        return api.get(url)
    }

    getOneEntryPage (symb, page) {
        let url = '/entry/s/pg/one'
        url += '?symb=' + symb
        url += '&page=' + page
        url += '&size=' + 10
        return api.get(url)
    }

    getEntryFileList (symb, c8tDtm) {
        return api.get('/entry/' + symb + '/file?c8tDtm=' + c8tDtm)
    }

    deleteActiveEntry (symb, c8tDtm) {
        return api.put('/entry/', { 'symb': symb, 'c8tDtm': c8tDtm })
    }

    downloadFileFd (fileUid) {
        return api.get('/entry/filefd/' + fileUid, { responseType: 'blob' })
    }

    getFileDbImg64 (fileUid) {
        return api.get('/entry/filedb64/' + fileUid)
    }

    getFileFdImg64 (fileUid) {
        return api.get('/entry/filefd64/' + fileUid)
    }
}

export default new StEntryService()