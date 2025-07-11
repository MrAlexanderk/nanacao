import request from "supertest";
import app from "../index.js";

describe("Operaciones CRUD de cafes", () => {
  
  test("GET /cafes devuelve status 200 y un arreglo con al menos un café", async () => {
    const response = await request(app).get("/cafes");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(typeof response.body[0]).toBe("object");
  });

  test("DELETE /cafes/:id con un id inexistente debe retornar 404", async () => {
    const response = await request(app)
      .delete("/cafes/9999")
      .set("Authorization", "Bearer token-falso");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
  });

  test("DELETE /cafes/:id sin token debe retornar 400", async () => {
    const response = await request(app).delete("/cafes/1");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("No recibió ningún token en las cabeceras");
  });

  test("POST /cafes agrega un nuevo café y retorna 201", async () => {
    const nuevoCafe = { id: Date.now(), nombre: "Latte Vainilla" };
    const response = await request(app)
      .post("/cafes")
      .send(nuevoCafe);
    expect(response.statusCode).toBe(201);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(nuevoCafe)])
    );
  });

  test("PUT /cafes/:id con id distinto al body debe retornar 400", async () => {
    const idParams = 1;
    const payload = { id: 999, nombre: "Espresso" };
    const response = await request(app)
      .put(`/cafes/${idParams}`)
      .send(payload);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "El id del parámetro no coincide con el id del café recibido"
    );
  });

});
