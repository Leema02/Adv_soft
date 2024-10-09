const express = require('express');
const authRouter = require('./routers/auth'); // Adjust the path accordingly
const itemRouter = require('./routers/itemRouter');
const catRouter = require('./routers/categoryRouter');



const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());


app.use('/', authRouter); // Use the auth router
app.use('/item',itemRouter);
app.use('/cat',catRouter);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});