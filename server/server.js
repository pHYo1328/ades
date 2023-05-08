const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./src/routes/routes");
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
app.use(router);


// Centralized temporary error handling
app.use((err, req, res, next) => {
    console.error(err); // for debugging
    const status = err.status || 500;
    return res.status(status).send({
            statusCode: status,
            ok: false,
            message: err.message || "Unknown server error",
            data: "",
        });
});


routes(app, router);    
const port = process.env.PORT || 8081;
app.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`);
});
