const express = require('express');
const authRouter = require('./routers/auth'); // Adjust the path accordingly
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());


app.use('/', authRouter); // Use the auth router

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
