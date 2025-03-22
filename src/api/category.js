import axios from "axios";

const API_BASE_URL = "http://localhost:8001/api/category";

export const getAllCategories = async (token) => {
	return await axios.get(`${API_BASE_URL}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getCategoryById = async (token, id) => {
	return await axios.get(`${API_BASE_URL}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
