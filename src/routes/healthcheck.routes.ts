// src/routes/healthcheck.ts
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Check if the server is healthy
 *     responses:
 *       200:
 *         description: Server is up and running
 */
router.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

export default router;
