import axios from 'axios';
import authHeader from "./auth-header";
import React from 'react';

const API_URL = "http://localhost:8080/api/public/subject/";

class SubjectService {
    getAllSubjects() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getSubjectById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createSubject(subjectName) {
        console.log(typeof subjectName);
        return axios.post(API_URL, {subjectName}, { headers: authHeader() });
    }

    updateSubjectInformation(id, subjectName, teachers) {
        return axios.put(API_URL + '/' + id, {
            subjectName,
            teachers
        });
    }

    deleteSubject(id) {
        return axios.delete(API_URL + '/' + id);
    }
}

export default new SubjectService();