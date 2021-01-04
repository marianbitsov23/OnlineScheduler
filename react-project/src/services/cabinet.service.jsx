import axios from 'axios';
import authHeader from "./auth-header";
import React from 'react';

const API_URL = "http://localhost:8080/api/cabinet/";

class CabinetService {
    getAllCabients() {
        return axios.get(API_URL);
    }

    getCabinetById(id) {
        return axios.get(API_URL + '/' + id);
    }

    createCabinet(cabinetName, specialCabinet) {
        return axios.post(API_URL, { cabinetName, specialCabinet} );
    }

    updateCabinetInformation(id, cabinetName, specialCabinet) {
        return axios.put(API_URL + '/' + id, {
            cabinetName,
            specialCabinet
        });
    }

    deleteCabinet(id) {
        return axios.delete(API_URL + '/' + id);
    }
}

export default new CabinetService();