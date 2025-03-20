import supertest from 'supertest'
import express from 'express'
import { connectToDatabase } from './config/cnx.js'
import router from './routes/actor.js'

const app = express()
let server

beforeAll(async () => {
    app.use(express.json())
    await connectToDatabase('local')
        .catch((err) => console.error(`Connecting to the local database: ${err}`))

    app.use(router)

    server = app.listen(4000)
})

afterAll((done) => {
    server.close(done)
})

global.api = supertest(app)