import axios from "axios";

// get account data
export const getMyAccount = async (token) => {
  return await axios(`http://localhost:8001/user/my-account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// update role for account
export const createUpdateAccount = async (token, input) => {
  return await axios.put("http://localhost:8001/user/update-account", input, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
