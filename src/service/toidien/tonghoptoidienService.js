import api from '../../Utils/Api'
const getTonghoptoidien = async () => {
    return await api.get('Tonghoptoitruc/getAll').then((response) => {
        return response
    });
};

const getTonghoptoidienById = async (id) => {
    return await api.get(`Tonghoptoitruc/${id}`).then((response) => {
        return response
    });
};
const addTonghoptoidien = async (data) => {
    return api.post(`Tonghoptoitruc`, data).then(response => {
        return response
    })
}
const updateTonghoptoidien = async (data) => {
    return api.put(`Tonghoptoitruc`, data).then(response => {
        return response
    })
}
const deleteTonghoptoidien = async (id) => {
    return await api.delete(`Tonghoptoitruc/${id}`).then(response => {
        return response
    })
}

const deleteTonghoptoidiens = async (datas) => {
    return await api.post(`Tonghoptoitruc/DeleteMultipale`, datas).then(response => {
        return response
    })
}

export const tonghoptoidienService = {
    getTonghoptoidien,
    getTonghoptoidienById,
    deleteTonghoptoidien,
    deleteTonghoptoidiens,
    addTonghoptoidien,
    updateTonghoptoidien,

}
