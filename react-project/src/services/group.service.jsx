import React from 'react';
import axios from 'axios';
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/public/group/";

class GroupService {
    getAllGroups() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getGroupById(id) {
        return axios.get(API_URL + '/' + id);
    }

    createGroup(group) {
        return axios.post(API_URL, 
            group,
            {headers: authHeader()} );
    }

    updateGroupInformation(group) {
        return axios.put(API_URL + '/' + group.id, 
            group,
            { headers: authHeader() });
    }

    deleteGroup(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new GroupService();