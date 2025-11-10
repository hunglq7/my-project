import api from '../../Utils/Api'
const getTonghoptoidien = async () => {
    return await api.get('Tonghoptoidien/getAll').then((response) => {
        return response
    });
};

const getQuatgioById = async (id) => {
    return await api.get(`Tonghopquatgio/${id}`).then((response) => {
        return response
    });
};
const addTonghopquatgio = async (data) => {
    return api.post(`Tonghopquatgio/create`, data).then(response => {
        return response
    })
}
const updateTonghopquatgio = async (data) => {
    return api.put(`Tonghopquatgio/update`, data).then(response => {
        return response
    })
}
const deleteQuatgio = async (id) => {
    return await api.delete(`Tonghopquatgio/${id}`).then(response => {
        return response
    })
}

const deleteQuatgios = async (datas) => {
    return await api.post(`Tonghopquatgio/DeleteMultipale`, datas).then(response => {
        return response
    })
}

export const tonghopquatgioService = {
    getQuatgio,
    getQuatgioById,
    deleteQuatgio,
    deleteQuatgios,
    addTonghopquatgio,
    updateTonghopquatgio,

}
