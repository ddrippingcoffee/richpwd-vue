import api from './api'

class StEntryService {

    save (stEntry) {
        return api.post('/entry/', stEntry)
    }

    getAllActiveEntry () {
        return api.get('/entry/act')
    }

    getAllOldEntry () {
        return api.get('/entry/old')
    }
}

export default new StEntryService()