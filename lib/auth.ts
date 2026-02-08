import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-me'

// Create a signed JWT token for a user. The route handler should set the cookie
// on the outgoing NextResponse (safer and compatible with app route handlers).
export function createSession(userId: string) {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: '30d' })
    return token
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    try {
        const payload = jwt.verify(session, SECRET) as { userId: string }
        return payload
    } catch (err) {
        return null
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
