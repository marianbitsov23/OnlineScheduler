import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/schedule/";

class ScheduleService {
    getScheduleById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    getSchedulesByCreatorId(creatorId) {
        return axios.get(API_URL + 'user/' + creatorId + '/schedules', 
        {headers: authHeader()});
    }

    createSchedule(scheduleName, description, creator, groupName) {
        return axios.post(API_URL,
            {scheduleName, description, creator, groupName} , 
            {headers: authHeader()});
    }

    saveCurrentSchedule = schedule => {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }

    updateScheduleInformation(id, scheduleName, session, creator, hours) {
        return axios.put(API_URL + '/' + id, 
        {   
            id,
            scheduleName,
            session,
            creator,
            hours   
        }, { headers: authHeader() });
    }

    getCurrentSchedule() {
        return JSON.parse(localStorage.getItem("schedule"));
    }
}

export default new ScheduleService();

