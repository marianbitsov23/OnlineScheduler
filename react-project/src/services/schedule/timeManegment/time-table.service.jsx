import axios from 'axios';
import authHeader from '../../user-auth/auth-header';
import React from 'react';

const API_URL = "http://localhost:8080/api/public/time-table/";

class TimeTableService {
    getAllTimeTables() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getTimeTableById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createTimeTable(weekDay, timeStart, timeEnd, timeTable) {
        return axios.post(API_URL, 
            {
                weekDay,
                timeStart,
                timeEnd,
                timeTable
            },
            {headers: authHeader()});
    }

    updateTimeTableInformation(slot) {
        return axios.put(API_URL + '/' + id,
            {
                weekDay,
                timeStart,
                timeEnd,
                timeTable
            }, 
            {headers: authHeader()});
    }

    deleteTimeTable(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TimeSlotService();