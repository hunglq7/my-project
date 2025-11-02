import api from '../Utils/Api'
const getQuatgio = async () => {
    return await api.get('Tonghopquatgio/getAll').then((response) => {
        return response
    });
};

const deleteQuatgio = async (id) => {
    return await api.delete(`Tonghopquatgio/${id}`).then(response => {
        return response
    })
}

const deleteQuatgios = async (maycaos) => {
    return await api.post(`Tonghopquatgio/DeleteMultipale`, maycaos).then(response => {
        return response
    })
}
export const quatgioService = {
    getQuatgio,
    deleteQuatgio,
    deleteQuatgios

}