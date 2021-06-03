import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/teaching-hour";

class TeachingHourService {
    getAllTeachingHours() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/teaching-hours', 
        {headers: authHeader()});
    }

    getAllByGroupId(groupId) {
        return axios.get(API_URL + '/group/' + groupId + '/teaching-hours', 
        {headers: authHeader()});
    }

    getTeachingHourById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }
    
    copy(oldScheduleId, newSchedule) {
        return axios.post(
            API_URL + '/copy/' + oldScheduleId, 
            newSchedule,
            { headers: authHeader() } 
        )
    }

    create(teachingHour) {
        return axios.post(API_URL, 
            {
                subject: teachingHour.subject,
                teacher: teachingHour.teacher,
                group: teachingHour.group,
                hoursPerWeek: teachingHour.hoursPerWeek,
                overAWeek: teachingHour.overAWeek,
                cabinet: teachingHour.cabinet,
                timeSlots: teachingHour.timeSlots,
                schedule: teachingHour.schedule
            },
            {headers: authHeader()});
    }

    update(teachingHour) {
        return axios.put(API_URL + '/' + teachingHour.id, 
        {
            id: teachingHour.id,
            group: teachingHour.group,
            subject: teachingHour.subject,
            teacher: teachingHour.teacher,
            hoursPerWeek: teachingHour.hoursPerWeek,
            overAWeek: teachingHour.overAWeek,
            cabinet: teachingHour.cabinet,
            timeSlots: teachingHour.timeSlots,
            schedule: teachingHour.schedule
        },
        {headers: authHeader()});
    }

    delete(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TeachingHourService();