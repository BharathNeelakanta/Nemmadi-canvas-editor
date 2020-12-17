import Axios from "axios"
const axios = Axios.create({
    baseURL: 'https://nbk.synctactic.ai'
})
export default axios