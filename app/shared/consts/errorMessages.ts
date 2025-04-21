import { FieldStatus } from '../types/FormStatus';

export const getFieldMessage = (field: string, status: FieldStatus): string => {
  const messages: Record<string, Partial<Record<FieldStatus, string>>> = {
    email: {
      invalid: '유효한 이메일 주소를 입력해주세요.',
      duplicated: '이미 존재하는 계정입니다.',
      success: '인증번호가 이메일로 전송되었습니다.',
      error: '이메일 인증 중 오류가 발생했습니다.',
    },
    nickname: {
      invalid: '2~8자의 한글, 영문, 숫자만 사용할 수 있어요.',
      duplicated: '이미 사용 중인 닉네임입니다.',
      success: '사용 가능한 닉네임입니다.',
      error: '닉네임 확인 중 오류가 발생했습니다.',
    },
    password: {
      invalid: '8~20자, 영문과 숫자를 포함해 입력해주세요.',
      error: '비밀번호 유효성 확인 중 오류가 발생했습니다.',
    },
    passwordCheck: {
      invalid: '비밀번호가 일치하지 않습니다.',
      error: '비밀번호 확인 중 오류가 발생했습니다.',
    },
    phoneNumber: {
      invalid: '숫자만 입력해주세요. (예: 01012345678)',
      error: '전화번호 유효성 확인 중 오류가 발생했습니다.',
    },
    code: {
      invalid: '인증번호가 올바르지 않습니다.',
      success: '인증이 완료되었습니다.',
      error: '인증번호 확인 중 오류가 발생했습니다.',
    },
    login: {
      invalid: '이메일 또는 비밀번호가 일치하지 않습니다.',
      success: '로그인 성공했습니다.',
      error: '서버 오류로 로그인에 실패했습니다.',
    },
  };

  return messages[field]?.[status] ?? '';
};
