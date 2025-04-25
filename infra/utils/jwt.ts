import jwt, { JwtPayload } from 'jsonwebtoken';

interface EmailTokenPayload {
  email: string;
  code?: string; // 인증번호가 포함될 수도 있음
}

interface AccessTokenPayload extends JwtPayload {
  user: {
    id: string;
    email: string;
    nickname: string;
    phone_number: string;
    provider: number;
  };
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

// access_token을 검증하고 payload(user)를 반환
export const verifyAccessToken = (token: string) => {
  const payload = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
  return {
    user: {
      id: payload.user.id,
      email: payload.user.email,
      nickname: payload.user.nickname,
      phone_number: payload.user.phone_number,
      provider: payload.user.provider,
    },
  };
};

// access_token 생성
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
};

// refresh_token 생성
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};
