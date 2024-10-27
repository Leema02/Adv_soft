const express = require('express');
const authRouter = require('./routers/auth'); // Adjust the path accordingly
const itemRouter = require('./routers/itemRouter');
const catRouter = require('./routers/categoryRouter');
const eventRouter = require('./routers/eventRouter');
const rentRouter = require('./routers/rentRouter');
const incomeRouter = require('./routers/incomeRouter');
const expertRouter = require('./routers/expertRouter');
const inspectionRouter = require('./routers/InspectionRouter');

const cookieParser = require('cookie-parser');
const {inspection} = require("./models/inspection");

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());


app.use('/', authRouter); // Use the auth router
app.use('/item', itemRouter);
app.use('/category', catRouter);
app.use('/event', eventRouter);
app.use('/rent', rentRouter);
app.use('/income/report',incomeRouter);
app.use('/expert',expertRouter);
app.use('/inspection',inspectionRouter);




app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});