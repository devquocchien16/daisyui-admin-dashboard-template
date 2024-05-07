import axios from "axios";
import api from "./appConfig";

const adminApi = {
    async findAdmin(adminId, token) {
        let result = null;
        try {
            result = await api.get(`admin/${adminId}`, {
                headers: { Authorization: "Bearer " + token },
            });
        } catch (e) {
            console.log("Find admin API error: " + e);
        }
        return result;
    },
    async loginAdmin(data) {

        let result = null;
        try {
            const url = '/login/admin';
            result = await api.post(url, data);
            console.log("login admin token: " + result);
        } catch (e) {
            console.log("Find admin API error: " + e);
        }
        return result;
    },
}

export default adminApi;