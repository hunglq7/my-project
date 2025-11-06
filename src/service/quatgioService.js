import api from '../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getQuatgio = async () => {
    return await api.get('Tonghopquatgio/getAll').then((response) => {
        return response
    });
};

const getQuatgioById = async (id) => {
    return await api.get(`Tonghopquatgio/${id}`).then((response) => {
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

const addTonghopquatgio = async (data) => {
    return api.post(`Tonghopquatgio/create`, data).then(response => {
        return response
    })
}
const updateTonghopquatgio = async (data) => {
    return api.put(`Tonghopquatgio/update`, data).then(response => {
        return response
    })
}

const updateDanhmucquatgios = async (data) => {
    return api.put(`Danhmucquatgio/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucquatgios = async (data) => {
    return api.put(`Danhmucquatgio/DeleteMultipale`, data).then(response => {
        return response
    })
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

const getDanhmucquatgio = async () => {
    return await api.get('Danhmucquatgio').then((response) => {
        return response
    });
};
export const quatgioService = {
    getQuatgio,
    getQuatgioById,
    deleteQuatgio,
    deleteQuatgios,
    getNhatkyById,
    addNhatkyquatgio,
    addNhatkyquatgios,
    deleteNhatkyQuatgios,
    getThongsoquatgioById,
    getDanhmucquatgio,
    addTonghopquatgio,
    updateTonghopquatgio,
    updateDanhmucquatgios,
    deleteDanhmucquatgios

}