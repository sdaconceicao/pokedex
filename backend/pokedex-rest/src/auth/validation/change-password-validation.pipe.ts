import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ChangePasswordRequestDto } from '../dtos/change-password-request.dto';
import { validatePassword } from './password.validation';

@Injectable()
export class ChangePasswordValidationPipe implements PipeTransform {
  transform(value: ChangePasswordRequestDto): ChangePasswordRequestDto {
    const errors: string[] = [];

    if (!value.currentPassword) {
      errors.push('Current password is required');
    }

    if (!value.password) {
      errors.push('New password is required');
    } else {
      const passwordValidation = validatePassword(value.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    // Cheap here because both values are in hand as plaintext — the reset flow
    // has no way to make this check. Stops a change that would do nothing.
    if (value.currentPassword && value.password === value.currentPassword) {
      errors.push('New password must be different from the current password');
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    // Passwords are returned untouched — unlike the reset pipe's token, trimming
    // would silently alter a credential the user chose, and login compares the
    // raw input.
    return {
      currentPassword: value.currentPassword,
      password: value.password,
    };
  }
}
