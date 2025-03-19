import axios from 'axios'

export const getUserChat = async (token) => {
    return await axios.get(`http://localhost:8001/api/messages/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const  getMessages = async (token, userId) => {
    return await axios.get(`http://localhost:8001/api/messages/:id`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}