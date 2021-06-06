import axios from "axios";
import { BACKEND_URL } from "../configuration";
import authHeader from "./auth-header";

const API_URL = BACKEND_URL + "api/public/";

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }
}

export default new UserService();