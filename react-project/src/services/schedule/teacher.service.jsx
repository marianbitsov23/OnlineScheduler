import axios from 'axios';
import { BACKEND_URL } from '../configuration';
import authHeader from '../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/teacher";

class TeacherService {
    getAllTeachers() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/teachers', 
        {headers: authHeader()});
    }

    getTeacherById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(teacher) {
        return axios.post(API_URL, 
            {name: teacher.name, initials: teacher.initials, schedule: teacher.schedule},
            {headers: authHeader()});
    }

    copy(oldScheduleId, newSchedule) {
        return axios.post(
            API_URL + '/copy/' + oldScheduleId, 
            newSchedule,
            { headers: authHeader() } 
        )
    }

    update(teacher) {
        return axios.put(API_URL + '/' + teacher.id, 
        {id: teacher.id, schedule: null, name: teacher.name, initials: teacher.initials},
        {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TeacherService();