import axios from "axios";

const getTotalNav = async () =>{
    let tnav = 0;
    await axios.get(`https://api.mfapi.in/mf/147888`)
    .then(data =>{
        if(data.status === 200) {
            tnav = parseFloat(data.data.data[0].nav)
        }
        }
    )
    .catch(err => {console.log(err); tnav = 0; })
    return tnav;
}

export default {
    getTotalNav
}
