import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateGroupRequestDto } from '../dtos/create-group-request.dto';
import { UpdateGroupRequestDto } from '../dtos/update-group-request.dto';
import { validateGroupName } from './group.validation';

type GroupRequestBody = CreateGroupRequestDto | UpdateGroupRequestDto;

@Injectable()
export class GroupRequestPipe implements PipeTransform {
  constructor(private readonly requireName: boolean) {}

  transform(value: GroupRequestBody): GroupRequestBody {
    const { name } = value;

    if (name === undefined) {
      if (this.requireName) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: ['Name is required'],
        });
      }
      return value;
    }

    const nameValidation = validateGroupName(name);
    if (!nameValidation.isValid) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: nameValidation.errors,
      });
    }

    return { ...value, name: name.trim() };
  }
}
