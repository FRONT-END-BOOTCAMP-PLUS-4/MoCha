export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (pw: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(pw);

export const doPasswordsMatch = (pw: string, pwCheck: string) => pw === pwCheck;

export const isValidNickname = (nickname: string) => /^[a-zA-Z0-9가-힣]{2,8}$/.test(nickname); // 특수문자 제외, 한글+영문+숫자 가능

export const isValidPhoneNumber = (phone: string) => /^\d{10,11}$/.test(phone); // 숫자만, 10~11자리 (01012345678)
