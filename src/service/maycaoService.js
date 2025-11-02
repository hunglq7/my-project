import api from '../Utils/Api'
const getMaycao = async () => {
    return await api.get('Tonghopmaycao/getAll').then((response) => {
        return response
    });
};

const deletemaycao = async (id) => {
    return await api.delete(`Tonghopmaycao/${id}`).then(response => {
        return response
    })
}

const deleteMaycaos = async (maycaos) => {
    return await api.post(`Tonghopmaycao/DeleteMultipale`, maycaos).then(response => {
        return response
    })
}
export const maycaoService = {
    getMaycao,
    deletemaycao,
    deleteMaycaos

}