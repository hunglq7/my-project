import api from '../../Utils/Api'
const updateDanhmuctoidien = async (data) => {
    console.log("data service", data)
    return api.put(`Danhmuctoitruc/UpdateMultiple`, data).then(response => {
        return response
    })
}
const deleteDanhmuctoidien = async (data) => {
    return api.post(`Danhmuctoitruc/DeleteMultipale`, data).then(response => {
        return response
    })
}
const getDanhmuctoidien = async () => {
    return await api.get('Danhmuctoitruc').then((response) => {
        return response
    });
};
export const danhmuctoidienService = {
    getDanhmuctoidien,
    updateDanhmuctoidien,
    deleteDanhmuctoidien,

}