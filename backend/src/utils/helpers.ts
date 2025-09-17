import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(userId: number, secret: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: '7d', issuer: 'ocean-hazard-platform' });
}

export function verifyToken(token: string, secret: string): any {
  return jwt.verify(token, secret);
}

export function formatSuccess(data: any, message = 'Success') {
  return { success: true, message, data };
}

export function formatError(message: string) {
  return { success: false, message };
}
