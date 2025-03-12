import axios from "axios";

export const getMyAccount = async (token) => {
	return await axios.get(`http://localhost:8001/user/my-account`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const createUpdateAccount = async (token, input) => {
	return await axios.put("http://localhost:8001/user/update-account", input, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
