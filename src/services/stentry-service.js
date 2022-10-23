import api from './api'

class StEntryService {

    save (stEntry) {
        return api.post('/entry/', stEntry).then(
            (res) => {
                return res.data
            }, (error) => {
                alert('Stock Entry 新增失敗:' + error)
            })
    }

    getAllActiveEntry () {
        return api.get('/entry/act')
    }

    getAllOldEntry () {
        return api.get('/entry/old')
    }
}

export default new StEntryService()