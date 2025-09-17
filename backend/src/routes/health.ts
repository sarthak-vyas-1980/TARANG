import { Hono } from 'hono';

const health = new Hono();

health.get('/api/health', (c) => c.json({ success: true, message: 'OK' }));

export default health;
