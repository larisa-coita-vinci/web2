import { Router } from "express";
import path from "node:path";
import { Film } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/films.json");

const defaultFilms: Film[] = [
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
  return res.json(defaultFilms);
});

router.get("/", (req, res) => {
  const films = parse(jsonDbPath, defaultFilms);
  const minDuration = Number(req.query['minimum-duration']);
  if (isNaN(minDuration) || minDuration <= 0) {
    return res.status(400).json({ error: "Wrong minimum duration" });
  }
  const filteredFilms = films.filter(film => film.duration >= minDuration);
  return res.json(filteredFilms);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const films = parse(jsonDbPath, defaultFilms);
  const film = films.find((film) => film.id === id);
  if (!film) {
    return res.status(404).json({ error: "Film not found" });
  }
  return res.json(film);
});

router.post("/", (req, res) => {
  const { title, director, duration, budget, description, imageUrl } = req.body;
  if (!title || !director || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ error: "Invalid data" });
  }
  const films = parse(jsonDbPath, defaultFilms);
  const existingFilm = films.find(film => film.title === title && film.director === director);
  if (existingFilm) {
    return res.status(409).json({ error: "Film already exist" })
  }
  const nextId = films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
  const newFilm = { id: nextId, title, director, duration, budget, description, imageUrl };
  films.push(newFilm);
  serialize(jsonDbPath, films);
  return res.json(newFilm);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const films = parse(jsonDbPath, defaultFilms);
  const index = films.findIndex((film) => film.id === id);
  if (index === -1) {
    return res.sendStatus(404);
  }
  films.splice(index, 1);
  serialize(jsonDbPath, films);
  return res.sendStatus(204);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const films = parse(jsonDbPath, defaultFilms);
  const film = films.find((film) => film.id === id);
  if (!film) {
    return res.sendStatus(404);
  }

  const body: Partial<Film> = req.body;

  if (
    ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("duration" in body && (typeof body.duration !== "number" || body.duration <= 0))
  ) {
    return res.sendStatus(400);
  }
  serialize(jsonDbPath, films);
  Object.assign(film, body);
  return res.json(film);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const films = parse(jsonDbPath, defaultFilms);
  const film = films.find((film) => film.id === id);
  if (!film) {
    return res.sendStatus(404);
  }

  const body: unknown = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    ("title" in body &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    ("budget" in body &&
      (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("duration" in body &&
      (typeof body.duration !== "number" || body.duration <= 0))
  ) {
    return res.sendStatus(400);
  }

  const { title, budget, duration }: Partial<Film> = body;

  if (title) {
    film.title = title;
  }
  if (budget) {
    film.budget = budget;
  }
  if (duration) {
    film.duration = duration;
  }

  return res.json(film);
});






export default router;