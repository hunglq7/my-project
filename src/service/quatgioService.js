import api from '../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getQuatgio = async () => {
    return await api.get('Tonghopquatgio/getAll').then((response) => {
        return response
    });
};

const getNhatkyById = async (id) => {
    return await api.get(`Nhatkyquatgio/DatailById/${id}`).then(response => {
        return response
    })
}

const getThongsoquatgioById = async (id) => {
    return await api.get(`Thongsokythuatmayxuc/DetailById/${id}`).then(response => {
        return response
    })
}

const addNhatkyquatgios = async (datas) => {
    console.log("Dữ liệu api", datas)
    return await api.put(`Nhatkyquatgio/UpdateMultiple`, datas).then(response => {
        return response
    })
}
const addNhatkyquatgio = async (data) => {
    // console.log("Dữ liệu api", data)
    // return await api.post(`Nhatkyquatgio`, data).then(response => {
    //     return response
    // })  
    console.log("Dữ liệu api", data)
    const response = await fetch(`${baseURL}/Nhatkyquatgio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    try {
        const json = await response.json()
        return json
    }
    catch (error) {
        return console.log(error)
    }

}

const deleteNhatkyQuatgios = async (datas) => {
    return await api.post(`Nhatkyquatgio/DeleteMultipale`, datas).then(response => {
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
export const quatgioService = {
    getQuatgio,
    deleteQuatgio,
    deleteQuatgios,
    getNhatkyById,
    addNhatkyquatgio,
    addNhatkyquatgios,
    deleteNhatkyQuatgios,
    getThongsoquatgioById

}