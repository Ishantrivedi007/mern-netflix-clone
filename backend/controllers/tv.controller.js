import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(request,response) {
    try {
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/tv/day?language=en-US')
        const randomTv = data?.results[Math.floor(Math.random()* data?.results?.length)]
        return response.status(200).json({success: true, content: randomTv, message: "Trending Tv fetched successfully."})
    } catch (error) {
        console.log(error.message);
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getTvTrailers(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
        return response.status(200).json({success: true, trailers: data?.results, message: "Tv trailers fetched successfully."})
    } catch (error) {
        if(error.message?.includes("404")){
            return response.status(404).send(null)
        }
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getTvDetails(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
        return response.status(200).json({success: true, content: data, message: "Tv details fetched successfully."})
    } catch (error) {
        if(error.message?.includes("404")){
            return response.status(404).send(null)
        }
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getSimilarTvs(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
        return response.status(200).json({success: true, similar: data.results, message: "Similar tvs fetched successfully."})
    } catch (error) {
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getTvsByCategory(request,response) {
    const {category} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        return response.status(200).json({success: true, content: data.results, message: "Tvs fetched successfully."})
    } catch (error) {
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}