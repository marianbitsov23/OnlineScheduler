import axios from "axios";
import { BACKEND_URL } from "../configuration";

const API_URL = BACKEND_URL + "api/auth/";

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

    changePassword(username, oldPassword, newPassword) {
        return axios.put(API_URL, { username, oldPassword, newPassword });
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.setItem("previousSchedules", JSON.stringify([]));
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    forgotPassword(email) {
        return axios.post(API_URL + "forgot_password", {
            email
        });
    }

    resetPassword(token, password) {
        return axios.post(API_URL + "reset_password", {
            token,
            password
        });
    }

    setCurrentUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
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