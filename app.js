const express = require('express');
const authRouter = require('./routers/auth'); // Adjust the path accordingly
const itemAvaRouterm = require('./routers/itemAvaRouter'); 
const loyaltyRouterm = require('./routers/loyaltyRouter');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());


app.use('/', authRouter); // Use the auth router
app.use('/', itemAvaRouterm);
app.use('/', loyaltyRouterm);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
