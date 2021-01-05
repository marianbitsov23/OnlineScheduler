import axios from 'axios';
import authHeader from "./auth-header";
import React from 'react';

const API_URL = "http://localhost:8080/api/public/cabinet/";

class CabinetService {
    getAllCabinets() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getCabinetById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createCabinet(cabinetName, specialCabinet) {
        return axios.post(API_URL, 
            {cabinetName, specialCabinet},
            {headers: authHeader()} );
    }

    updateCabinetInformation(id, cabinetName, specialCabinet) {
        return axios.put(API_URL + '/' + id, {
            cabinetName,
            specialCabinet
        }, { headers: authHeader() });
    }

    deleteCabinet(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new CabinetService();