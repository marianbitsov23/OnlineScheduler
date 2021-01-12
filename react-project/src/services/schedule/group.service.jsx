import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/group";

class GroupService {
    getAllGroups() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getGroupById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createGroup(parent, groupName, children, schedule) {
        return axios.post(API_URL, 
            {parent, groupName, children, schedule},
            {headers: authHeader()} );
    }

    updateGroupInformation(group) {
        return axios.put(API_URL + '/' + group.id, 
            //{group info},
            {headers: authHeader()});
    }

    deleteGroup(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new GroupService();