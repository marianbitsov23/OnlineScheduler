import axios from 'axios';
import { BACKEND_URL } from '../configuration';
import authHeader from '../user-auth/auth-header';

const API_URL = BACKEND_URL + "api/public/lesson";

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
                timeTable: lesson.timeTable,
                group: lesson.group,
                teachingHour: lesson.teachingHour,
                subLessonOneTeachingHour: lesson.subLessonOneTeachingHour,
                subLessonTwoTeachingHour: lesson.subLessonTwoTeachingHour
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
                timeTable: lesson.timeTable,
                group: lesson.group,
                teachingHour: lesson.teachingHour,
                subLessonOneTeachingHour: lesson.subLessonOneTeachingHour,
                subLessonTwoTeachingHour: lesson.subLessonTwoTeachingHour
            },
            {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new LessonService();