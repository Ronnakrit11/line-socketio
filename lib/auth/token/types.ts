import { JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
  username: string;
}

export interface TokenVerificationResult {
  isValid: boolean;
  payload: TokenPayload | null;
}