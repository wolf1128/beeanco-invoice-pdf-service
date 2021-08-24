const express = require('express');
const app = express();
const invoices = require('./routes/invoices');


app.use(express.json());
app.use('/api/invoices', invoices);


const port = process.env.PORT || 3000;
app.listen(port, console.log('Server is running...'));