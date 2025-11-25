import api from '../../Utils/Api'
const updateDanhmucmayxucs = async (data) => {
    return api.put(`Mayxuc/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucmayxucs = async (data) => {
    return api.post(`Mayxuc/DeleteMultipale`, data).then(response => {
        return response
    })
}



const getDanhmucmayxucs = async () => {
    return await api.get('Mayxuc').then((response) => {
        return response
    });
};

export const danhmucmayxucService = {
    getDanhmucmayxucs,
    updateDanhmucmayxucs,
    deleteDanhmucmayxucs,

}