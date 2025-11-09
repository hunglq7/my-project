import api from '../../Utils/Api'
const getThongsoquatgio = async () => {
    return await api.get('Thongsoquatgio').then((response) => {
        return response
    });
};


const addThongsoquatgio = async (data) => {
    return api.post(`Thongsoquatgio`, data).then(response => {
        return response
    })
}
const updateThongsoquatgio = async (data) => {
    return api.put(`Thongsoquatgio/update`, data).then(response => {
        return response
    })
}
const deleteThongsoquatgio = async (id) => {
    return api.delete(`Thongsoquatgio/${id}`).then(response => {
        return response
    })
}
const deleteSelectThongsoquatgio = async (data) => {
    return api.post(`Thongsoquatgio/DeleteMultipale`, data).then(response => {
        return response
    })
}
const getThongsoquatgioById = async (id) => {
    return await api.get(`Thongsoquatgio/DetailById/${id}`).then(response => {
        return response
    })
}

const getThongsoquatDetailgioById = async (id) => {
    return await api.get(`Thongsoquatgio/${id}`).then(response => {
        return response
    })
}



export const thongsoquatgioService = {
    getThongsoquatgioById,
    getThongsoquatgio,
    addThongsoquatgio,
    updateThongsoquatgio,
    deleteThongsoquatgio,
    deleteSelectThongsoquatgio,
    getThongsoquatDetailgioById
}