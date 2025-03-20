import { Surreal } from 'surrealdb'
import 'dotenv/config'

const db = new Surreal()

async function connectToDatabase(environment = 'cloud') {
    
    const namespace = process.env.DB_NM
    const database = process.env.DB_NAME
    
    const url = (environment === 'cloud')
        ? process.env.URL_INSTANCE
        : process.env.URL_INSTANCE_TEST

    const credentials = (environment === 'cloud')
        ? { username: process.env.DB_USER, password: process.env.DB_PASS }
        : { username: "root", password: "root" }

    await db
        .connect(url, {
        namespace: namespace,
        database: database
    })

    await db.signin(credentials)

    await db.use(namespace, database)
}

export { db, connectToDatabase}