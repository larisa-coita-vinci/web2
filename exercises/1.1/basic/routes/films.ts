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

export default router;