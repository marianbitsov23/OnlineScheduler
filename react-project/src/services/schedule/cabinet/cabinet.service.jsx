import axios from 'axios';
import authHeader from '../../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/cabinet";

class CabinetService {
    getAllCabinets() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getAllCabinetsByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/cabinets', 
        {headers: authHeader()});
    }

    getCabinetById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(cabinet) {
        return axios.post(API_URL, 
            {name: cabinet.name, categories: cabinet.categories, schedule: cabinet.schedule},
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