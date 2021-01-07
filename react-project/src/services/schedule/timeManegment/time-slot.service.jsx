import axios from 'axios';
import authHeader from '../../user-auth/auth-header';
import React from 'react';

const API_URL = "http://localhost:8080/api/public/time-slot";

class TimeSlotService {
    getAllTimeSlots() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getTimeSlotById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    getTimeSlotByTimeTableId(timeTableId) {
        return axios.get(API_URL + '/' + timeTableId, { headers: authHeader() });
    }

    async createTimeSlot(weekDay, timeStart, timeEnd, tableId) {
        return axios.post(API_URL, 
            {
                weekDay,
                timeStart,
                timeEnd,
                tableId
            },
            {headers: authHeader()});
    }

    updateTimeSlotInformation(id, weekDay, timeStart, timeEnd, timeTable) {
        return axios.put(API_URL + '/' + id,
            {
                weekDay,
                timeStart,
                timeEnd,
                timeTable
            }, 
            {headers: authHeader()});
    }

    deleteTimeSlot(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TimeSlotService();