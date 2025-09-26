import { fetchFromTMDB } from "../services/tmdb.service.js";
import User from "../models/user.model.js";

export async function searchPerson(request, response) {
  const { query } = request.params;
  try {
    const person = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&page=1&include_adult=false&language=en-US`
    );

    if (person.results.length === 0) {
      return response.status(404).send(null);
    }
    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: person.results[0].id,
          image: person.results[0].profile_path,
          title: person.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    return response.status(200).json({
      success: true,
      content: person.results,
      message: "Search results fetched successfully.",
    });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
export async function searchMovie(request, response) {
  const { query } = request.params;
  try {
    const movieResponse = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&page=1&language=en-US&include_adult=false`
    );

    if (movieResponse.results.length === 0) {
      return response.status(404).send(null);
    }
    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: movieResponse.results[0].id,
          image: movieResponse.results[0].poster_path,
          title: movieResponse.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    return response.status(200).json({
      success: true,
      content: movieResponse.results,
      message: "Search results fetched successfully.",
    });
  } catch (error) {
    console.log("Error in searchMovie controller: ", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
export async function searchTv(request, response) {
  const { query } = request.params;
  try {
    const tvResponse = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&page=1&language=en-US&include_adult=false`
    );

    if (tvResponse.results.length === 0) {
      return tvResponse.status(404).send(null);
    }
    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: tvResponse.results[0].id,
          image: tvResponse.results[0].poster_path,
          title: tvResponse.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });

    return response.status(200).json({
      success: true,
      content: tvResponse.results,
      message: "Search results fetched successfully.",
    });
  } catch (error) {
    console.log("Error in searchTv controller: ", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchHistory(request, response) {
  try {
    return response.status(200).json({
      success: true,
      content: request.user.searchHistory,
      message: "Search history fetched successfully.",
    });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(request, response) {
  let { id } = request.params;
  id = parseInt(id);

  try {
    await User.findByIdAndUpdate(request.user._id, {
      $pull: {
        //to remove something from an array
        searchHistory: {
          id: id,
        },
      },
    });
    return response.status(200).json({
      success: true,
      message: "Item removed from search history successfully.",
    });
  } catch (error) {
    console.log(
      "Error in removeItemFromSearchHistory controller: ",
      error.message
    );
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
