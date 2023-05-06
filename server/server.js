require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 8081;
app.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`);
});
