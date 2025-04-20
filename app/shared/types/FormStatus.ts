export type FieldStatus = 'none' | 'invalid' | 'duplicated' | 'valid' | 'success' | 'error';

export type FormStatus = {
  email?: FieldStatus;
  nickname?: FieldStatus;
  password?: FieldStatus;
  passwordCheck?: FieldStatus;
  phoneNumber?: FieldStatus;
  code?: FieldStatus;
  login?: FieldStatus;
};
