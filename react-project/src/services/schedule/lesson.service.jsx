import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/lesson";

class LessonService {
    getAllLessons() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getAllLessonsByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/subjects', 
        {headers: authHeader()});
    }

    getLessonById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(lesson) {
        return axios.post(API_URL, 
            { 
                name: lesson.name,
                timeTable: lesson.timeTable,
                schedule: lesson.schedule ,
                teachingHours: lesson.teachingHours
            },
            { headers: authHeader() });
    }

    update(lesson) {
        return axios.put(API_URL + '/' + lesson.id, 
            {
                id: lesson.id, 
                name: lesson.name,
                timeTable: lesson.timeTable,
                schedule: lesson.schedule ,
                teachingHours: lesson.teachingHours
            },
            {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new LessonService();