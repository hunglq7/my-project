import { data } from 'autoprefixer';
import api from '../Utils/Api'

const getChucvu = async () => {
    return await api.get('Chucvu').then((response) => {
        return response
    });
};
const addChucvu = async (data) => {
    return await api.post('Chucvu', data).then(response => {
        return response
    })
}

const deleteChucvu = async (id) => {
    return await api.delete(`Chucvu/${id}`).then(response => {
        return response
    })
}

const deleteChucvus = async (chucvus) => {
    return await api.post(`Chucvu/DeleteMultipale`, chucvus).then(response => {
        return response
    })
}
const updateChucvu = async (data) => {
    return await api.put('Chucvu/update', data).then(response => {
        return response
    })
}
export const chucvuService = {
    getChucvu,
    addChucvu,
    updateChucvu,
    deleteChucvu,
    deleteChucvus
}