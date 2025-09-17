import { Hono } from 'hono';
import {
  hashPassword,
  comparePassword,
  generateToken,
  formatSuccess,
  formatError
} from '../utils/helpers.js';
import { Role } from '@prisma/client';
import { createPrismaClient } from '../lib/prisma.js';

const auth = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  },
  Variables: {
    prisma: ReturnType<typeof createPrismaClient>;
  };
}>();

auth.post('/register', async (c) => {
  console.log("API HIT")
  const prisma = c.get('prisma');
  const { name, email, password, role  } = await c.req.json() as {
    name?: string; email: string; password: string; role?: Role;
  };
  if (!email || !password) return c.json(formatError('Email and password required'), 400);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return c.json(formatError('Email in use'), 409);

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role }
  });
  const token = generateToken(user.id, c.env.JWT_SECRET as string);
  return c.json(formatSuccess({ user, token }, 'Registered'), 201);
});

auth.post('/login', async (c) => {
  const prisma = c.get('prisma');
  const { email, password } = await c.req.json() as { email: string; password: string };
  if (!email || !password) return c.json(formatError('Email and password required'), 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    return c.json(formatError('Invalid credentials'), 401);
  }
  const token = generateToken(user.id, c.env.JWT_SECRET as string);
  return c.json(formatSuccess({ user, token }, 'Logged in'));
});

export default auth;
