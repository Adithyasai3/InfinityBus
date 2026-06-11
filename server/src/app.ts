import express from "express";
import routes from "./routes";
import { auth } from "./middleware/auth.middleware";
import busRoutes from "./modules/bus/bus.routes";
import tripRoutes from "./modules/trip/trip.routes";
const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
| express.json()
|
| Converts incoming JSON request body into JavaScript object.
|
| Example:
| POST /login
| {
|   "email": "test@gmail.com",
|   "password": "123456"
| }
|
| After parsing:
| req.body.email
| req.body.password
|--------------------------------------------------------------------------
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
| Used to verify server is running.
|
| GET /
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("Server Working");
});

/*
|--------------------------------------------------------------------------
| Main Routes
|--------------------------------------------------------------------------
| All routes inside ./routes will start with /api
|
| Example:
| app.use("/api", routes)
|
| routes.ts:
| router.post("/login")
|
| Final URL:
| /api/login
|--------------------------------------------------------------------------
*/
app.use("/api", routes);

/*
|--------------------------------------------------------------------------
| Protected Test Route
|--------------------------------------------------------------------------
| Flow:
|
| Request
|   ↓
| auth middleware
|   ↓
| JWT verification
|   ↓
| next()
|   ↓
| Route handler executes
|
| GET /test
|--------------------------------------------------------------------------
*/
app.get("/test", auth, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
  });
});

/*
|--------------------------------------------------------------------------
| Bus Module Routes
|--------------------------------------------------------------------------
| All bus routes will start with:
| /api/buses
|
| Example:
|
| router.post("/")
| Final URL:
| POST /api/buses
|
| router.get("/")
| Final URL:
| GET /api/buses
|
| router.get("/:id")
| Final URL:
| GET /api/buses/1
|--------------------------------------------------------------------------
*/
app.use("/api/buses", busRoutes);

/*
|--------------------------------------------------------------------------
| Export App
|--------------------------------------------------------------------------
| Exporting app so it can be used in server.ts
|--------------------------------------------------------------------------
*/
app.use("/api/trips", tripRoutes);
export default app;