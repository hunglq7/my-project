import api from '../../Utils/Api'
const updateDanhmucmaycaos = async (data) => {
    return api.put(`Danhmucmaycao/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucmaycaos = async (data) => {
    return api.post(`Danhmucmaycao/DeleteMultipale`, data).then(response => {
        return response
    })
}



const getDanhmucmaycaos = async () => {
    return await api.get('Danhmucmaycao').then((response) => {
        return response
    });
};

export const danhmucmaycaoService = {
    getDanhmucmaycaos,
    updateDanhmucmaycaos,
    deleteDanhmucmaycaos,

}