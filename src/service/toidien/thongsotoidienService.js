import api from '../../Utils/Api'
const getThongsotoidien = async () => {
    return await api.get('Thongsokythuattoitruc').then((response) => {
        return response
    });
};


const addThongsotoidien = async (data) => {
    return api.post(`Thongsokythuattoitruc`, data).then(response => {
        return response
    })
}
const updateThongsotoidien = async (data) => {
    return api.put(`Thongsokythuattoitruc/update`, data).then(response => {
        return response
    })
}
const deleteThongsotoidien = async (id) => {
    return api.delete(`Thongsokythuattoitruc/${id}`).then(response => {
        return response
    })
}
const deleteSelectThongsotoidien = async (data) => {
    return api.post(`Thongsokythuattoitruc/DeleteMultipale`, data).then(response => {
        return response
    })
}
const getThongsotoidienById = async (id) => {
    return await api.get(`Thongsokythuattoitruc/${id}`).then(response => {
        return response
    })
}

const getThongsotoidienDetailById = async (id) => {
    return await api.get(`Thongsokythuattoitruc/DetailById/${id}`).then(response => {
        return response
    })
}



export const thongsotoidienService = {
    getThongsotoidienById,
    getThongsotoidien,
    addThongsotoidien,
    updateThongsotoidien,
    deleteThongsotoidien,
    deleteSelectThongsotoidien,
    getThongsotoidienDetailById
}