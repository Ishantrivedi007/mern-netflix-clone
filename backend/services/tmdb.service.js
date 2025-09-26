import axios from "axios"
import { ENV_VARS } from "../config/envVars.js";


export const fetchFromTMDB = async (url)=>{
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ENV_VARS.TMDB_API_TOKEN}`
    }
};
//'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
    const response = await axios.get(url,options);

    if(response.status !== 200){
        throw new Error("Failed to fetch data from TMDB" + response.statusText);
    }

    return response.data;
}