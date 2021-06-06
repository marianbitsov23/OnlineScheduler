import axios from 'axios';
import { BACKEND_URL } from '../configuration';
import authHeader from '../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/subject";

class SubjectService {
    getAllSubjects() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/subjects', 
        {headers: authHeader()});
    }

    getSubjectById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    copy(oldScheduleId, newSchedule) {
        return axios.post(
            API_URL + '/copy/' + oldScheduleId, 
            newSchedule,
            { headers: authHeader() } 
        )
    }

    create(subject) {
        return axios.post(API_URL, { name: subject.name, schedule: subject.schedule }, { headers: authHeader() });
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