const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

const errorMiddleware = require('./middleware/error-middleware')

const manhwaRouter = require('./routers/manhwa-router')
const usersRouter = require('./routers/users-router')

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/manhwa', manhwaRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})