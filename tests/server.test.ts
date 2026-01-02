import request from "supertest"
import { describe, it, expect } from "vitest"
import { app } from "../src/server.ts"

describe("Health Check", () => {
    it("Should return OK status", async () => {
        const response = await request(app)
            .get("/health")
            .expect(200)

        expect(response.body.status).toBe("OK")
        expect(response.body.service).toBe("Habit Tracker API")
    })
})