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

    deleteActiveEntry (symb, c8tDtm) {
        return api.put('/entry/', { 'symb': symb, 'c8tDtm': c8tDtm })
    }

    downloadFileFd (fileUid) {
        return api.get('/entry/filefd/' + fileUid, { responseType: 'blob' })
    }
}

export default new StEntryService()