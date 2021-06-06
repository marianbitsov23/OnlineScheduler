import axios from 'axios';
import { BACKEND_URL } from '../configuration';
import authHeader from '../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/schedule";

class ScheduleService {
    getScheduleById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    getSchedulesByCreatorId(creatorId) {
        return axios.get(API_URL + '/user/' + creatorId + '/schedules', 
        {headers: authHeader()});
    }

    createSchedule(name, description, creator, groupName, schoolType) {
        return axios.post(API_URL,
            {name, description, creator, groupName, schoolType} , 
            {headers: authHeader()});
    }

    saveCurrentSchedule = schedule => {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }

    updateScheduleInformation(id, name, session, creator, hours) {
        return axios.put(API_URL + '/' + id, 
        {   
            id,
            name,
            session,
            creator,
            hours   
        }, { headers: authHeader() });
    }

    deleteSchedule(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }

    getCurrentSchedule() {
        return JSON.parse(localStorage.getItem("schedule"));
    }

    setPreviousSchedules(schedules) {
        localStorage.setItem("previousSchedules", JSON.stringify(schedules));
    }

    getPreviousSchedules() {
        return JSON.parse(localStorage.getItem("previousSchedules"));
    }
}

export default new ScheduleService();

