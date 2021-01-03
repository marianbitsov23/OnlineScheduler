import axios from 'axios';
import authHeader from "./auth-header";
import React from 'react';

const API_URL = "http://localhost:8080/api/subject/";

class SubjectService {
    getAllSubjects() {
        return axios.get(API_URL);
    }

    getSubjectById(id) {
        return axios.get(API_URL + '/' + id);
    }

    createSubject(subjectName) {
        return axios.post(API_URL, subjectName);
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