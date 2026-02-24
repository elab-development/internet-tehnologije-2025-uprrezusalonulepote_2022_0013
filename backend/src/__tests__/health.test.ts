import request from "supertest";

const BASE_URL = process.env.BACKEND_BASE_URL ?? "http://localhost:3001";

describe("GET /api/health", () => {
  it("vraca ok: true", async () => {
    const res = await request(BASE_URL).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});