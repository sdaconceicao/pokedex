import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { RegisterRequestDto } from '../dtos/register-request.dto';
import {
  validatePassword,
  validateEmail,
  validateUsername,
  validateName,
} from './password.validation';

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  transform(value: RegisterRequestDto): RegisterRequestDto {
    const errors: string[] = [];

    // Validate first name
    if (!value.firstName?.trim()) {
      errors.push('First name is required');
    } else if (!validateName(value.firstName.trim())) {
      errors.push(
        'First name must be 2-50 characters and contain only letters and spaces',
      );
    }

    // Validate last name
    if (!value.lastName?.trim()) {
      errors.push('Last name is required');
    } else if (!validateName(value.lastName.trim())) {
      errors.push(
        'Last name must be 2-50 characters and contain only letters and spaces',
      );
    }

    // Validate username
    if (!value.username?.trim()) {
      errors.push('Username is required');
    } else if (!validateUsername(value.username.trim())) {
      errors.push(
        'Username must be 3-20 characters and contain only letters, numbers, and underscores',
      );
    }

    // Validate email
    if (!value.email?.trim()) {
      errors.push('Email is required');
    } else if (!validateEmail(value.email.trim())) {
      errors.push('Please enter a valid email address');
    }

    // Validate password
    if (!value.password) {
      errors.push('Password is required');
    } else {
      const passwordValidation = validatePassword(value.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    // Return cleaned data
    return {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      username: value.username.trim(),
      email: value.email.trim(),
      password: value.password,
    };
  }
}
