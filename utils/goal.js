import axios from "axios";
import goalsDb from "../db/goals.js";


const getTotalNav = async () =>{
    let tnav = 0;
    await axios.get(`https://api.mfapi.in/mf/147888`)
    .then(data =>{
        if(data.status === 200) {
            tnav = parseFloat(data.data.data[0].nav)
        }
        }
    )
    return tnav;
}


export default {
    getTotalNav
}