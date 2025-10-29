import api from '../Utils/Api'
const loginWithUserCredentials = async (email, password) => {
    const data = {
        email, password
    }
    return await api.post('Users/authenticate', data).then((response) => {
        localStorage.setItem("session", JSON.stringify(response));
        return response
    });
}

const accessToken = () => {
    return localStorage['session']
        ? JSON.parse(localStorage['session']).resultObj
        : null;
}
const logout = () => {
    localStorage.clear();
};

export const authService = {
    loginWithUserCredentials,
    logout,
    accessToken
}