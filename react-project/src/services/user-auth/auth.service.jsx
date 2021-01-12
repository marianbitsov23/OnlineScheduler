import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
    login(username, password) {
        return axios
        .post(API_URL + "signin", {
            username,
            password
        })
        .then(response => {
            if(response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    udpateUserInformation(user) {
        return axios
            .put(API_URL + 'user/' + user.id, user);
    }

    deleteUser(id) {
        return axios
            .delete(API_URL + 'user/' + id)
    }
}

export default new AuthService();