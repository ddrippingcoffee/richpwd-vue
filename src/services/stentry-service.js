import api from './api'

class StEntryService {

    save (stEntry) {
        return api.post('/entry/stores', stEntry).then(
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

    deleteActiveEntry (symb, c8tDtm) {
        return api.put('/entry/', { 'symb': symb, 'c8tDtm': c8tDtm }).then(
            (res) => {
                return res
            }, (error) => {
                alert('Stock Entry 刪除失敗:' + error)
            })
    }

    downloadFileFd (fileUid) {
        return api.get('/entry/filefd/' + fileUid, { responseType: 'blob' })
    }
}

export default new StEntryService()