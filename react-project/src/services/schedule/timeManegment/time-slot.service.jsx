import axios from 'axios';
import authHeader from '../../user-auth/auth-header';
import React from 'react';

const API_URL = "http://localhost:8080/api/public/time-slot/";

class TimeSlotService {
    getAllTimeSlots() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getTimeSlotById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createTimeSlot(slot) {
        return axios.post(API_URL, 
            //{slot info},
            {headers: authHeader()});
    }

    updateTimeSlotInformation(slot) {
        return axios.put(API_URL + '/' + id,
            //{slot info}, 
            {headers: authHeader()});
    }

    deleteTimeSlot(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new TimeSlotService();