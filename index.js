import express from "express";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const cafes = JSON.parse(fs.readFileSync("./cafes.json", "utf-8"));

const app = express();
app.use(express.json());

let cafesList = [...cafes];

app.get("/cafes", (req, res) => {
  res.status(200).send(cafesList);
});

app.get("/cafes/:id", (req, res) => {
  const { id } = req.params;
  const cafe = cafesList.find(c => c.id == id);
  if (cafe) res.status(200).send(cafe);
  else res.status(404).send({ message: "No se encontró ningún cafe con ese id" });
});

app.post("/cafes", (req, res) => {
  const cafe = req.body;
  const { id } = cafe;
  const existeUnCafeConEseId = cafesList.some(c => c.id == id);
  if (existeUnCafeConEseId) {
    res.status(400).send({ message: "Ya existe un cafe con ese id" });
  } else {
    cafesList.push(cafe);
    res.status(201).send(cafesList);
  }
});

app.put("/cafes/:id", (req, res) => {
  const cafe = req.body;
  const { id } = req.params;
  if (id != cafe.id)
    return res.status(400).send({
      message: "El id del parámetro no coincide con el id del café recibido",
    });

  const cafeIndex = cafesList.findIndex(c => c.id == id);
  if (cafeIndex >= 0) {
    cafesList[cafeIndex] = cafe;
    res.send(cafesList);
  } else {
    res.status(404).send({ message: "No se encontró ningún café con ese id" });
  }
});

app.delete("/cafes/:id", (req, res) => {
  const jwt = req.header("Authorization");
  if (jwt) {
    const { id } = req.params;
    const cafeIndex = cafesList.findIndex(c => c.id == id);

    if (cafeIndex >= 0) {
      cafesList.splice(cafeIndex, 1);
      res.send(cafesList);
    } else {
      res.status(404).send({ message: "No se encontró ningún cafe con ese id" });
    }
  } else {
    res.status(400).send({ message: "No recibió ningún token en las cabeceras" });
  }
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "La ruta que intenta consultar no existe" });
});

// Solo levantar servidor si se ejecuta directamente
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`SERVER ON port ${PORT}`));
}

export default app;
