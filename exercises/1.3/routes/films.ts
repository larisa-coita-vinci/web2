import { Router } from "express";
import { Film } from "../types";

const films: Film[] = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148,
    budget: 160,
    description: "https://example.com/inception-description",
    imageUrl: "https://example.com/inception-image"
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Lana Wachowski, Lilly Wachowski",
    duration: 136,
    budget: 63,
    description: "https://example.com/matrix-description",
    imageUrl: "https://example.com/matrix-image"
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    duration: 169,
    budget: 165,
    description: "https://example.com/interstellar-description",
    imageUrl: "https://example.com/interstellar-image"
  }
];

const router = Router();

router.get("/", (_req, res) => {
  return res.json(films);
});

router.get("/films", (req, res) => {
  const minDuration = Number(req.query['minimum-duration']);
  if (isNaN(minDuration) || minDuration <= 0) {
    return res.status(400).json({ error: "Wrong minimum duration" });
  }
  const filteredFilms = films.filter(film => film.duration >= minDuration);
  return res.json(filteredFilms);
});

router.get("/films/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const film = films.find((film) => film.id === id);
  if (!film) {
    return res.status(404).json({ error: "Film not found" });
  }
  return res.json(film);
});

router.post("/films", (req, res) => {
  const { title, director, duration, budget, description, imageUrl } = req.body;
  if (!title || !director || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ error: "Invalid data" });
  }
  const nextId = films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
  const newFilm = { id: nextId, title, director, duration, budget, description, imageUrl };
  films.push(newFilm);
  return res.json(newFilm);
});

export default router;