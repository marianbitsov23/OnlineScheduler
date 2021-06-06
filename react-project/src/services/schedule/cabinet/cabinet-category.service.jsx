import axios from 'axios';
import { BACKEND_URL } from '../../configuration';
import authHeader from '../../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/cabinet-category";

class CabinetCategoryService {
    getAllCabinetCategories() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getDefaultCabinetCategories() {
        return axios.get(API_URL + '/default/', 
        {headers: authHeader()});
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/categories', 
        {headers: authHeader()});
    }

    getCabinetCategoryById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(category) {
        return axios.post(API_URL, 
            {name: category.name, schedule: category.schedule},
            {headers: authHeader()} );
    }

    updateCabinetCategoryInformation(id, name) {
        return axios.put(API_URL + '/' + id, 
            {name},
            {headers: authHeader()});
    }

    deleteCabinetCategory(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new CabinetCategoryService();