import jwt from 'jsonwebtoken';

interface EmailTokenPayload {
  email: string;
  code?: string; // 인증번호가 포함될 수도 있음
}

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// 이메일 인증용 JWT 토큰 생성 함수
export const createVerificationToken = (payload: { email: string; code: string }) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '5m' });
};

// 이메일 인증 토큰 검증 후 payload(email, code 등) 반환
export function verifyEmailToken(token: string): EmailTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as EmailTokenPayload;
}

// access_token을 검증하고 payload(id, email)를 반환
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as { id: string; email: string };
};

// access_token 생성
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
};

// refresh_token 생성
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};
