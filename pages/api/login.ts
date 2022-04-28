import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import {
    JWT_SECRET,
    ACCESS_TOKEN,
    COOKIE_SETTINGS
} from '../../utils/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        res.json({ error: 'Missing credentials.' })
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                time: Date.now()
            },
            JWT_SECRET,
            {
                expiresIn: '8h'
            }
        )

        res.setHeader(
            'Set-Cookie',
            cookie.serialize(ACCESS_TOKEN, token, COOKIE_SETTINGS)
        )

        res.json(user)
    } else {
        res.status(401)
        res.json({ error: 'Invalid Credentials' })
        // add in a user login tracking to build into a lock out
    }
}
