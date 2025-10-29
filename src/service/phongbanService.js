import api from '../Utils/Api'

const getPhongban = async () => {
    return await api.get('Phongban').then((response) => {
        return response
    });
};
export const phongbanService = {
    getPhongban
}