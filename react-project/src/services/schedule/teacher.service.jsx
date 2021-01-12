import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/teacher";

class TeacherService {
    getAllTeachers() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getTeacherById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createTeacher(teacherName, initials, schedule) {
        return axios.post(API_URL, 
            {teacherName, initials, schedule},
            {headers: authHeader()});
    }

    updateTeacherInformation(id, teacherName, initials) {
        return axios.put(API_URL + '/' + id, 
        {id, schedule: null, teacherName, initials},
        {headers: authHeader()});
    }

    deleteTeacher(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TeacherService();