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

    createSubject(name, schedule) {
        return axios.post(API_URL, {name, schedule}, { headers: authHeader() });
    }

    update(subject) {
        return axios.put(API_URL + '/' + subject.id, 
            {id: subject.id, name: subject.name, schedule: subject.schedule, hours: subject.hours},
            {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new SubjectService();