import express from 'express';
import invoices from './routes/invoices';

const app = express();

app.use(express.json());
app.use('/api/invoices', invoices);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running...')
});