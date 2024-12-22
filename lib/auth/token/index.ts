import { jwtVerify, SignJWT } from 'jose';
import { TokenPayload, TokenVerificationResult } from './types';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
);

export async function verifyToken(token: string): Promise<TokenVerificationResult> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload as unknown;

    // Type guard to verify payload shape
    if (isTokenPayload(payload)) {
      return { 
        isValid: true, 
        payload 
      };
    }

    return {
      isValid: false,
      payload: null
    };

  } catch (error) {
    return { 
      isValid: false, 
      payload: null 
    };
  }
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

// Type guard function
function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'username' in payload &&
    typeof (payload as TokenPayload).username === 'string'
  );
}

export type { TokenPayload, TokenVerificationResult };