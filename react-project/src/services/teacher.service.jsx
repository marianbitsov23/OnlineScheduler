import axios from 'axios';
import authHeader from "./auth-header";
import React from 'react';

const API_URL = "http://localhost:8080/api/teacher/";

class TeacherService {
    getAllTeachers() {
        return axios.get(API_URL);
    }

    getTeacherById(id) {
        return axios.get(API_URL + '/' + id);
    }

    createTeacher(teacherName, subjects) {
        return axios.post(API_URL, { teacherName, subjects });
    }

    updateTeacherInformation(id, teacherName, subjects) {
        return axios.put(API_URL + '/' + id, {
            teacherName,
            subjects
        });
    }

    deleteTeacher(id) {
        return axios.delete(API_URL + '/' + id);
    }
}

export default new TeacherService();