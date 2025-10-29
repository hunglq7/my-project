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
export const chucvuService = {
    getChucvu,
    addChucvu
}