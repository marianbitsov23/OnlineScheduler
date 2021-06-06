import axios from 'axios';
import { BACKEND_URL } from '../../configuration';
import authHeader from '../../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/time-table";

class TimeTableService {
    getAllTimeTables() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    copy(oldScheduleId, newSchedule) {
        return axios.post(
            API_URL + '/copy/' + oldScheduleId, 
            newSchedule,
            { headers: authHeader() } 
        )
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/time-tables', 
        {headers: authHeader()});
    }

    getTimeTableById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(timeTable) {
        return axios.post(API_URL, 
            {
                schedule: timeTable.schedule,
                name: timeTable.name
            }, {headers: authHeader()});
    }

    update(timeTable) {
        return axios.put(API_URL + '/' + timeTable.id,
            {
                schedule: timeTable.schedule,
                name: timeTable.name,
                timeSlots: timeTable.timeSlots
            }, {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TimeTableService();