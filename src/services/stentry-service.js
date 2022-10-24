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

    deleteActiveEntry (symb, c8tDtm) {
        return api.put('/entry/', { 'symb': symb, 'c8tDtm': c8tDtm }).then(
            (res) => {
                if (1 === res.data) {
                    alert('Stock Entry 刪除成功')
                }
            }, (error) => {
                alert('Stock Entry 刪除失敗:' + error)
            })
    }
}

export default new StEntryService()