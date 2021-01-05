import React from 'react';
import axios from 'axios';
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/public/schedule/";

class ScheduleService {
    getScheduleById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    getSchedulesByCreatorId(creatorId) {
        return axios.get(API_URL + 'user/' + creatorId + '/schedules', 
        { headers: authHeader() });
    }

    createSchedule(scheduleName, session, creator) {
        return axios.post(API_URL,
            { scheduleName, session, creator } , 
            { headers: authHeader() });
    }

    updateScheduleInformation(id, scheduleName, session, creator, hours) {
        return axios.put(API_URL + '/' + id, {   
            id,
            scheduleName,
            session,
            creator,
            hours   
        }, { headers: authHeader() });
    }
}

export default new ScheduleService();

