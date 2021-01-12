import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/subject";

class SubjectService {
    getAllSubjects() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getSubjectById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createSubject(subjectName, schedule) {
        return axios.post(API_URL, {subjectName, schedule}, { headers: authHeader() });
    }

    updateSubjectInformation(id, subjectName, schedule, hours) {
        return axios.put(API_URL + '/' + id, 
            {id, subjectName, schedule, hours},
            {headers: authHeader()});
    }

    deleteSubject(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new SubjectService();