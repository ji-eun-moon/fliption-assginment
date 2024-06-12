import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateUserDTO } from '../dtos/create-user.dto';

/**
 * 비밀번호와 비밀번호 확인 필드가 일치하는지 확인하는 Validator
 */
@ValidatorConstraint({ name: 'PasswordMatch', async: false })
export class PasswordMatch implements ValidatorConstraintInterface {
  validate(passwordConfirm: string, args: ValidationArguments) {
    const object = args.object as CreateUserDTO;
    return object.password === passwordConfirm;
  }

  defaultMessage(_args: ValidationArguments) {
    return '비밀번호가 일치하지 않습니다.';
  }
}
