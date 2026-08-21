import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AddGroupPokemonRequestDto } from '../dtos/add-group-pokemon-request.dto';
import { validatePokemonRef } from './group.validation';

@Injectable()
export class GroupPokemonRequestPipe implements PipeTransform {
  transform(value: AddGroupPokemonRequestDto): AddGroupPokemonRequestDto {
    const errors: string[] = [];

    const pokemonIdResult = validatePokemonRef(value?.pokemonId, 'pokemonId');
    errors.push(...pokemonIdResult.errors);

    const speciesIdResult = validatePokemonRef(value?.speciesId, 'speciesId');
    errors.push(...speciesIdResult.errors);

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    return value;
  }
}
