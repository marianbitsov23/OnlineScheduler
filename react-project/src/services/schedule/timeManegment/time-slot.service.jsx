import axios from 'axios';
import authHeader from '../../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/time-slot";

class TimeSlotService {
    getAllTimeSlots() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getTimeSlotById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    async getTimeSlotsByTimeTableId(timeTableId) {
        return axios.get(API_URL + '/table/' + timeTableId, { headers: authHeader() });
    }

    async createTimeSlot(weekDay, timeStart, timeEnd, tableId) {
        return axios.post(API_URL, 
            {
                weekDay,
                timeStart,
                timeEnd,
                tableId
            },
            {headers: authHeader()});
    }

    updateTimeSlotInformation(id, weekDay, timeStart, timeEnd, timeTable) {
        return axios.put(API_URL + '/' + id,
            {
                weekDay,
                timeStart,
                timeEnd,
                timeTable
            }, 
            {headers: authHeader()});
    }

    deleteTimeSlot(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }

    deleteTimeSlotsByTimeTableId(timeTableId) {
        return axios.delete(API_URL + '/table/' + timeTableId + "/slots", 
        { headers: authHeader() });
    }
}

export default new TimeSlotService();