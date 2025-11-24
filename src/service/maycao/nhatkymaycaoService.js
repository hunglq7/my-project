import api from '../../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getNhatkyById = async (id) => {
    return await api.get(`Nhatkymaycao/DatailById/${id}`).then(response => {
        return response
    })
}


const addNhatkymaycaos = async (datas) => {
debugger;
    return await api.put(`Nhatkymaycao/UpdateMultiple`, datas).then(response => {
        return response
    })
}
const addNhatkymaycao = async (data) => {
  
    const response = await fetch(`${baseURL}/Nhatkymaycao`, {
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
const deleteNhatkyMaycaos = async (datas) => {
    return await api.post(`Nhatkymaycao/DeleteMultipale`, datas).then(response => {
        return response
    })
}


export const nhatkymaycaoService = {
    getNhatkyById,
    addNhatkymaycao,
    addNhatkymaycaos,
    deleteNhatkyMaycaos,

}
