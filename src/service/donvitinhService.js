import api from '../Utils/Api'

const getDonvitinh = async () => {
    return await api.get('Donvitinh').then((response) => {
        return response
    });
};

const addDonvitinh = async (donvitinh) => {
    return await api.post(`Donvitinh`, donvitinh).then((response) => {
        return response

    });
}
export const donvitinhService = {
    getDonvitinh,
    addDonvitinh
}