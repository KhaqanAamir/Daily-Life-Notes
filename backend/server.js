import express from 'express'
import connectToMongo from './database/db.js' 
import app from './app.js'
import loginRouter from './routes/loginRoutes.js'
import notesRouter from './routes/notesRoutes.js'

const port = 5000
connectToMongo()

// it is used so we can use req.body else if not used it will give us undefined
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Available routes

app.use('/auth',loginRouter)
app.use('/notes',notesRouter)
