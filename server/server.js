require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./src/routes/routes');
const path = require('path');
const corsOptions = require('../server/src/config/corsOptions');
const { logger } = require('../server/src/middlewares/logEvents');
const errorHandler = require('../server/src/middlewares/errorHandler');
const verifyJWT = require('../server/src/middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('../server/src/middlewares/credentials');

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes

// app.use('/', require('../server/src/routes/root'));
// app.use('/register', require('../server/src/routes/register'));
app.use('/auth', require('../server/src/routes/auth'));
// // app.use('/refresh', require('../server/src/routes/refresh'));
// // app.use('/logout', require('../server/src/routes/logout'));

// app.use(verifyJWT);
// // app.use('/employees', require('../server/src/routes/api/employees'));
// // app.use('/users', require('../server/src/routes/api/users'));

// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'));
//     } else if (req.accepts('json')) {
//         res.json({ "error": "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });

app.use(errorHandler);

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
// will use morgan and winston for global error handling
// still testing with ah tan's concept
app.use((err, req, res, next) => {
  console.error(err); // for debugging
  const status = err.status || 500;
  return res.status(status).send({
    statusCode: status,
    ok: false,
    message: err.message || 'Unknown server error',
    data: '',
  });
});

routes(app, router);
const port = process.env.PORT || 8081;
app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});
