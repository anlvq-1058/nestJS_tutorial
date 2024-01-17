import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

const PW_REG_EXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export class AuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(PW_REG_EXP, {
    message: `password must…..`,
  })
  readonly password: string;
}
