import express from "express";
import routes from "./routes";
import { auth } from "./middleware/auth.middleware";

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


export default app;