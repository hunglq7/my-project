import api from '../../Utils/Api'
const updateDanhmucquatgios = async (data) => {
    return api.put(`Danhmucquatgio/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucquatgios = async (data) => {
    return api.post(`Danhmucquatgio/DeleteMultipale`, data).then(response => {
        return response
    })
}



const getDanhmucquatgio = async () => {
    return await api.get('Danhmucquatgio').then((response) => {
        return response
    });
};

export const danhmucquatgioService = {
    getDanhmucquatgio,
    updateDanhmucquatgios,
    deleteDanhmucquatgios,

}