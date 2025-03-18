const express = require('express');
const app = express();
require('dotenv').config({})
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const trendRouter = require('./routes/trendRoutes');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');

const PORT = process.env.PORT || 3004

app.set('trust proxy', 1)
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align:center">server is listening!</h1>')
})

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests sent by this ip, please try again in an hour !'
});

app.use('/api', limiter)

console.log(PORT,'port');



app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', authRouter, productRouter, trendRouter)

app.all('*', (req, res, next) => {
    res.status(404).send('Sorry, we could not find that route!');
});

app.listen(PORT, () => {
    console.info('app is listening on port ',PORT);
})

// connectDb()