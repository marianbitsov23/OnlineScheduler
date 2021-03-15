import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/lesson";

class LessonService {
    getAllLessons() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    checkIfLessonsExist(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/exist/lessons',
        {headers: authHeader()});
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/lessons', 
        {headers: authHeader()});
    }

    getLessonById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(lesson) {
        return axios.post(API_URL, 
            { 
                schedule: lesson.schedule,
                weekDay: lesson.weekDay,
                slotIndex: lesson.slotIndex,
                teachingHour: lesson.teachingHour
            },
            { headers: authHeader() });
    }

    update(lesson) {
        return axios.put(API_URL + '/' + lesson.id, 
            {
                id: lesson.id, 
                schedule: lesson.schedule,
                weekDay: lesson.weekDay,
                slotIndex: lesson.slotIndex,
                teachingHour: lesson.teachingHour
            },
            {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new LessonService();