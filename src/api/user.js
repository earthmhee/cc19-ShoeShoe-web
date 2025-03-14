import axios from "axios";

// get account data
export const createMyAccount = async (token) => {
  return await axios.get("http://localhost:8001/api/user/my-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// update role for account
export const createUpdateAccount = async (token, input) => {
  return await axios.put("http://localhost:8001/api/user/update-account", input, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};