import axios from "axios"

export const checkout = async (token, id) => {
    return await axios.post(`http://localhost:8001/api/payment/checkout/`, { id }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const checkOutStatus = async (token, session) => {
    return await axios.post(`http://localhost:8001/api/payment/checkout-status/${session}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}