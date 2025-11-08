import api from '../../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getNhatkyById = async (id) => {
    return await api.get(`Nhatkyquatgio/DatailById/${id}`).then(response => {
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
const deleteNhatkyQuatgios = async (datas) => {
    return await api.post(`Nhatkyquatgio/DeleteMultipale`, datas).then(response => {
        return response
    })
}


export const nhatkyquatgioService = {
    getNhatkyById,
    addNhatkyquatgio,
    addNhatkyquatgios,
    deleteNhatkyQuatgios,

}
