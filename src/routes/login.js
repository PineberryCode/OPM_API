import { Router } from 'express'
import CryptoJS from 'crypto-js'
import 'dotenv/config'
import { client } from '../index.js'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import { EXPIRATION, FROM_EMAIL, PASSWORD, RATE_LIMIT, SALT } from '../utils/data.js'

const authRouter = Router()

authRouter.get('/api/generateCode', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "It does not contains the property 'email'",
            status: 400
        })
    }

    const existEmail = await client.get(email)
    if (existEmail) {
        return res.status(200).json({
            message: "Cannot generate the code twice",
            status: 200
        })
    }

    const code = uuidv4()

    try {
        const message = {
            from: `OPM API <${FROM_EMAIL}>`,
            to: email,
            subject: "Generated verification code",
            text: code,
            headers: {
                "X-Entity-Ref-ID": "newemail"
            }
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: FROM_EMAIL,
                pass: PASSWORD
            },
            tls: { rejectUnauthorized: process.env.NODE_ENV === "production" }
        })

        await transporter.sendMail(message)

        await client.set(email, JSON.stringify(email))

        return res.status(200).json({ message: "Code sent", status: 200 })
    } catch (err) {
        return res.status(500).json({
            message: err,
            status: 500
        })
    }
})

authRouter.post('/api/generateToken', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    try {
        const code = req.headers['x-auth-code']

        if (!code) {
            return res.status(400).json({
                message: "Missing 'x-auth-code' in headers",
                status: 400
            })
        }

        const savedToken = await client.get(code)
        if (savedToken) {
            const bytes = CryptoJS.AES.decrypt(savedToken, SALT)
            const decryptToken = bytes.toString(CryptoJS.enc.Utf8)

            // Verify time expiration
            if (decryptToken.expiration >= Date.now()) {
                // Encrypt new token
                return await encryptData(
                    res, 
                    req.socket.remoteAddress, 
                    code, 
                    Date.now() + EXPIRATION
                )
            }

            return res.status(200).json({
                token: savedToken,
                code: 200
            })
        }

        return await encryptData(res, req.socket.remoteAddress, code, Date.now() + EXPIRATION)
    } catch (err) {
        console.error('Generate token: ', err)
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        })
    }
})

const encryptData = async (res, ip, code, expiration) => {
    const data = {
        user: ip,
        code: code,
        exp: expiration
    }

    const encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), SALT).toString()

    // Save in Redis
    await client.set(code, encryptData)

    await client.set(encryptData, RATE_LIMIT.toString())

    return res.status(200).json({
        token: encryptData,
        status: 200
    })

}

export default authRouter