const router = require("express");
const app = router();
const Controller = require("../controllers/AuthController");

app.post("/api/v1/register", Controller.Register);
app.post("/api/v1/login", Controller.Login);


module.exports = app;