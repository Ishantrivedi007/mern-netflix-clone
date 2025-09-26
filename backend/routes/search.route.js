import express from 'express';
import { searchPerson, searchMovie, searchTv, searchHistory, removeItemFromSearchHistory } from '../controllers/search.controller.js';

const router = express.Router();

router.get("/person/:query",searchPerson)
router.get("/movie/:query",searchMovie)
router.get("/tv/:query",searchTv)

//search history routes
router.get("/history",searchHistory);

router.delete("/history/:id",removeItemFromSearchHistory)

export default router;