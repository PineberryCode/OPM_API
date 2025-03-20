import express from 'express'
import morgan from 'morgan'
import router from './routes/actor.js'
import authRouter from './routes/login.js'
import { connectToDatabase } from './config/cnx.js'
import responseTime from 'response-time'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express()

export const client = createClient({
  host: '127.0.0.1',
  port: 6379
})

app.use(express.json())

if (process.env.NODE_ENV !== "test") {
  app.use(responseTime())

  // morgan('dev') is the formatted output in the 
  // terminal when somebody does a request
  app.use(morgan('dev'))

  app.use(authRouter)
  app.use(router)

  app.listen(3000, async () => {
    await client.connect()
    await connectToDatabase().catch((err) => console.error(`Connecting to the Surreal Cloud: ${err}`))
    console.log(`OPM API listening on http://localhost:3000`)
  })
}

export default app
