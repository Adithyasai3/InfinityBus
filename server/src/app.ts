import express from "express";
import routes from "./routes";
import { auth } from "./middleware/auth.middleware";
import busRoutes from "./modules/bus/bus.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.use("/api", routes);

app.get("/test", auth, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
  });
});

app.use("/api/buses", busRoutes);
export default app;