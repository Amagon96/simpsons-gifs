const port = process.env.PORT || 3000;
const app = require('./app');

app.listen(port, () => console.log(`App listening at ${process.env.HOST}:${port}`));