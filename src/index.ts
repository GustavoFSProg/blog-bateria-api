import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import bodyParser from "body-parser";

dotenv.config();

const { PORT } = process.env;

const api = express();

api.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
api.use(express.json({ limit: "10kb" }));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(helmet());
api.use(routes);

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: "Muitas requisições desse IP, por favor tente em uma hora.",
});

api.use("/tawk", limiter);
api.use(
  express.urlencoded({
    extended: true,
  }),
);

api.listen(PORT, () => {
  console.log(`Api Rodando: ${PORT}`);
});

export default api;
