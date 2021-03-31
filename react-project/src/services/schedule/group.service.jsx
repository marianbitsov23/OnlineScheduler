import axios from 'axios';
import authHeader from '../user-auth/auth-header';

const API_URL = "http://localhost:8080/api/public/group";

class GroupService {
    getAllGroups() {
        return axios.get(API_URL, { headers: authHeader() } );
    }

    getAllByScheduleId(scheduleId) {
        return axios.get(API_URL + '/schedule/' + scheduleId + '/groups', 
        {headers: authHeader()});
    }

    getAllByParentId(parentId) {
        return axios.get(API_URL + '/parent/' + parentId + '/children', 
        {headers: authHeader()});
    }

    getAllTeachingGroups(scheduleId) {
        return axios.get(API_URL + '/teaching/' + scheduleId, 
        {headers: authHeader()});
    }

    getGroupById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    create(group) {
        return axios.post(API_URL, 
            {
                parent: group.parent,
                name: group.name, 
                children: group.children, 
                schedule: group.schedule
            },
            {headers: authHeader()} );
    }

    update(group) {
        return axios.put(API_URL + '/' + group.id, 
            {
                parent: group.parent,
                name: group.name, 
                schedule: group.schedule
            },
            {headers: authHeader()});
    }

    deleteGroup(id) {
        return axios.delete(API_URL + '/' + id, { headers: authHeader() });
    }
}

export default new GroupService();