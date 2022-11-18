import api from './api'

class StEntryService {

    save (stEntry) {
        return api.post('/entry/stores', stEntry)
    }

    getAllActiveEntry () {
        return api.get('/entry/act')
    }

    getAllOldEntry () {
        return api.get('/entry/old')
    }

    getActiveEntryPage (page) {
        let url = '/entry/s/pg/act'
        url += '?page=' + page
        url += '&size=' + 3
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getOldEntryPage (page) {
        let url = '/entry/s/pg/old'
        url += '?page=' + page
        url += '&size=' + 3
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getEntryFileList (symb, c8tDtm) {
        return api.get('/entry/' + symb + '/file?c8tDtm=' + c8tDtm)
    }

    getAllEntryBySymbSlice (symb, page) {
        let url = '/entry/s/sl/'
        url += 'symb?symb=' + symb
        url += '&page=' + page
        url += '&size=' + 3
        url += '&desc=' + 'desc'
        return api.get(url)
    }

    getAllEntryByComNmSlice (comNm, page) {
        let url = '/entry/s/sl/'
        url += 'comNm?comNm=' + comNm
        url += '&page=' + page
        url += '&size=' + 3
        url += '&desc=' + 'desc'
        return api.get(url)
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