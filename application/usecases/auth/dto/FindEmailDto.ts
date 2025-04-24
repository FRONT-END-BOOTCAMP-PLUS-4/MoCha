export class FindEmailRequestDto {
  constructor(
    public nickname: string,
    public phoneNumber: string
  ) {}
}
