import axios from 'axios'
import { API_URL } from '../constants'

export const apiCall = async (
    endpoint: string,
    method: any = 'get',
    body: any = {},
    contentType = 'application/json',
) => {

    const headers = {
        Accept: 'application/json',
        'Content-Type': contentType
    }

    const resp = await axios({
        method,
        baseURL: API_URL,
        url: endpoint,
        data: body,
        params: method.toLowerCase() === 'get' ? body : null,
        headers
    })
        .then(response => response.data)
        .catch(error => console.log(error))
    return resp
}