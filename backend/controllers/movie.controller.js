import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(request,response) {
    try {
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US')
        const randomMovie = data?.results[Math.floor(Math.random()* data?.results?.length)]
        return response.status(200).json({success: true, content: randomMovie, message: "Trending movie fetched successfully."})
    } catch (error) {
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getMovieTrailers(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        return response.status(200).json({success: true, trailers: data?.results, message: "Movie trailers fetched successfully."})
    } catch (error) {
        if(error.message?.includes("404")){
            return response.status(404).send(null)
        }
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getMovieDetails(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        return response.status(200).json({success: true, content: data, message: "Movie details fetched successfully."})
    } catch (error) {
        if(error.message?.includes("404")){
            return response.status(404).send(null)
        }
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getSimilarMovies(request,response) {
    const {id} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        return response.status(200).json({success: true, similar: data.results, message: "Similar movies fetched successfully."})
    } catch (error) {
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getMoviesByCategory(request,response) {
    const {category} = request.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
        return response.status(200).json({success: true, content: data.results, message: "Movies fetched successfully."})
    } catch (error) {
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}