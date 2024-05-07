import axios from "axios";
import api from "./appConfig";

export const getSellers = async () => {
    try {
        const response = await fetch('http://localhost:5454/api/admin/sellers');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch sellers');
    }
};