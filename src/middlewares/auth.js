import 'dotenv/config'
import { client } from '../index.js'
import CryptoJS from 'crypto-js'
import { SALT } from '../utils/data.js'

/**
 * 
 * @param {*} code the unique code provided from "header"
 * @param {*} token provided from "header"
 * @returns a boolean
 */
const authenticateToken = async (req, res, next) => {
    try {
        if (process.env.NODE_ENV === "test") return next()

        const token = req.headers['x-auth-token']
        const code = req.headers['x-auth-code']

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: Missing x-auth-token header',
                status: 401
            })
        }

        if (!code) {
            return res.status(400).json({
                message: 'Bad request: Missing x-auth-code header',
                status: 400
            })
        }

        const savedToken = await client.get(code)
        if (!savedToken) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
                status: 401
            })
        }

        const savedRateLimit = await client.get(savedToken)

        if (token != savedToken.replaceAll('"', '')) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
                status: 401
            })
        }

        const bytes = CryptoJS.AES.decrypt(savedToken, SALT)
        const decryptToken = bytes.toString(CryptoJS.enc.Utf8)

        // Verify time expiration
        if (decryptToken.expiration <= Date.now()) {
            return res.status(401).json({
                message: 'Unauthorized: Expired token, you must generate a new token.',
                status: 401
            })
        }

        // Verify the rate limit
        if (savedRateLimit == 0) {
            return res.status(401).json({
                message: 'Unauthorized: Exceeded request limit.',
                status: 401
            })
        }

        // Parsed Rate Limit
        const parsedRL = parseInt(savedRateLimit, 10)

        const newRateLimit = parsedRL != 0 ? parsedRL - 1 : 0

        await client.set(savedToken, newRateLimit.toString())

        next()
    } catch (err) {
        console.error('authenticateToken: ', err)

        return res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
            status: 401
        })
    }
}

export default authenticateToken