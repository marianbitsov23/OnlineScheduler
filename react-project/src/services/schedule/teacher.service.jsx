import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/teacher";

class TeacherService {
    getAllTeachers() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getAllTeachersByScheduleId(scheduleId) {
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