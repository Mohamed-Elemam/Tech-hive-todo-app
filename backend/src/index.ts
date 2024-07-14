import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");
    // Further database operations can be performed here
  } catch (error) {
    console.error("Database connection error:", error);
  }
  // finally {
  //   await prisma.$disconnect();
  //   console.log("Disconnected from database");
  // }
}

main();
