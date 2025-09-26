// const express = require('express'); //commonjs
import express from "express"; //es6 module
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js"; // Importing auth routes
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectToDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const port = ENV_VARS.PORT;
const __dirname = path.resolve();

// app.get("/",(request, response)=>{
//     response.send("Welcome to Netflix clone backend");
// })
app.use(express.json()); //Allows us to parse request body
app.use(cookieParser()); //Allows us to parse cookies

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (request, response) => {
    response.sendFile(
      path.resolve(__dirname, "frontend", "dist", "index.html")
    );
  });
}

app.listen(port, () => {
  console.log(`Netflix clone Server is running on port ${port}`);
  connectToDB();
});
