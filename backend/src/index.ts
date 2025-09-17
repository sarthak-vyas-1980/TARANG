import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { verify } from 'hono/jwt'
import { createPrismaClient } from './lib/prisma.js'
import auth from './routes/auth.js'
import reports from './routes/reports.js'
import health from './routes/health.js'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  },
  Variables: {
    prisma: ReturnType<typeof createPrismaClient>;
  };
}>();

app.use('*', async (c, next) => {
  c.set('prisma', createPrismaClient(c.env.DATABASE_URL));
  await next();
});

// Public routes
app.route('*', health)
app.route('/api/auth', auth)

// Custom JWT middleware for Workers environment
// app.use('/api/*', async (c, next) => {
//   const authHeader = c.req.header('Authorization')
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return c.json({ success: false, message: 'Authorization header required' }, 401)
//   }

//   const token = authHeader.substring(7)
//   try {
//     const payload = await verify(token, c.env.JWT_SECRET as string)
//     c.set('jwtPayload', payload)
//     await next()
//   } catch (error) {
//     return c.json({ success: false, message: 'Invalid token' }, 403)
//   }
// })

// Protected routes
app.route('/api/reports/*', reports)

app.all('*', (c) => c.json({ success: false, message: 'Not Found' }, 404))

export default app
