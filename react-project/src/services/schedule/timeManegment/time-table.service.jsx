import axios from 'axios';
import authHeader from '../../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/time-table";

class TimeTableService {
    getAllTimeTables() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getTimeTableById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createTimeTable(schedule, timeTableName, timeSlots) {
        return axios.post(API_URL, 
            {
                schedule,
                timeTableName
            }, {headers: authHeader()});
    }

    updateTimeTableInformation(id, schedule, timeTableName, timeSlots) {
        return axios.put(API_URL + '/' + id,
            {
                schedule,
                timeTableName,
                timeSlots
            }, {headers: authHeader()});
    }

    deleteTimeTable(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TimeTableService();