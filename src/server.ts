import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import ClientRoutes from "./routes/ClientRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import DebtorRoutes from "./routes/DebtorRoutes";
import OrderRoutes from "./routes/OrderRoutes";

dotenv.config();
connectDB();
const app = express();
app.use(cors(corsConfig));
app.use(express.json());

app.use("/api/client", ClientRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/debtor", DebtorRoutes);
app.use("/api/order", OrderRoutes);
export default app;
