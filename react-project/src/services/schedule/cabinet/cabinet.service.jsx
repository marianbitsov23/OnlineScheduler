import axios from 'axios';
import authHeader from '../../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/cabinet";

class CabinetService {
    getAllCabinets() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getCabinetById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createCabinet(name, categories, schedule) {
        return axios.post(API_URL, 
            {name, categories, schedule},
            {headers: authHeader()} );
    }

    update(cabinet) {
        return axios.put(API_URL + '/' + cabinet.id, 
            {name: cabinet.name, categories: cabinet.categories},
            {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new CabinetService();