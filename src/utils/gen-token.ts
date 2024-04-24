import { sign } from 'jsonwebtoken';
import { readFileSync } from 'fs';

export function genToken(userId: string) {
  const privateKey = readFileSync('src/keys/private.key');
  return sign({ userId }, privateKey, { algorithm: 'RS256' });
}
