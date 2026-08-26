import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AddGroupPokemonRequestDto } from './dtos/add-group-pokemon-request.dto';
import { CreateGroupRequestDto } from './dtos/create-group-request.dto';
import { UpdateGroupRequestDto } from './dtos/update-group-request.dto';
import { GroupPokemonEntity } from './group-pokemon.entity';
import { GroupEntity } from './groups.entity';

const POSTGRES_UNIQUE_VIOLATION = '23505';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: string }).code === POSTGRES_UNIQUE_VIOLATION
  );
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,
    @InjectRepository(GroupPokemonEntity)
    private groupPokemonRepository: Repository<GroupPokemonEntity>,
    private dataSource: DataSource,
  ) {}

  async findAllForUser(userId: string): Promise<GroupEntity[]> {
    const { entities, raw } = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin('group.pokemon', 'pokemon')
      .addSelect('COUNT(pokemon.id)', 'pokemonCount')
      .where('group.userId = :userId', { userId })
      .groupBy('group.id')
      // Alphabetical only: the UI marks the default with a badge rather
      // than hoisting it, and callers identify the default by its
      // isDefault flag, not by array position -- nothing depends on the
      // default sorting first.
      .orderBy('group.name', 'ASC')
      .getRawAndEntities<{ pokemonCount: string }>();

    entities.forEach((group, index) => {
      group.pokemonCount = Number(raw[index].pokemonCount);
    });

    return entities;
  }

  // Scope by userId so another user's group id returns 404, not 403.
  async findOneForUser(userId: string, id: string): Promise<GroupEntity> {
    const group = await this.groupsRepository.findOne({
      where: { id, userId },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async create(
    userId: string,
    dto: CreateGroupRequestDto,
  ): Promise<GroupEntity> {
    return this.dataSource.transaction(async (manager) => {
      const count = await manager.count(GroupEntity, { where: { userId } });
      const isDefault = dto.isDefault === true || count === 0;

      if (isDefault) {
        await manager.update(GroupEntity, { userId }, { isDefault: false });
      }

      const group = manager.create(GroupEntity, {
        userId,
        name: dto.name,
        isDefault,
      });

      try {
        return await manager.save(group);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ConflictException('A group with that name already exists');
        }
        throw error;
      }
    });
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateGroupRequestDto,
  ): Promise<GroupEntity> {
    return this.dataSource.transaction(async (manager) => {
      const group = await manager.findOne(GroupEntity, {
        where: { id, userId },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }

      if (dto.isDefault === true) {
        await manager.update(GroupEntity, { userId }, { isDefault: false });
      }

      const changes: Partial<GroupEntity> = {};
      if (dto.isDefault === true) {
        changes.isDefault = true;
      }
      if (dto.name !== undefined) {
        changes.name = dto.name;
      }

      if (Object.keys(changes).length > 0) {
        try {
          await manager.update(GroupEntity, { id }, changes);
        } catch (error) {
          if (isUniqueViolation(error)) {
            throw new ConflictException(
              'A group with that name already exists',
            );
          }
          throw error;
        }
      }

      return manager.findOneOrFail(GroupEntity, { where: { id } });
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const group = await manager.findOne(GroupEntity, {
        where: { id, userId },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const wasDefault = group.isDefault;

      await manager.delete(GroupEntity, { id });

      if (wasDefault) {
        const oldest = await manager.findOne(GroupEntity, {
          where: { userId },
          order: { createdAt: 'ASC' },
        });
        if (oldest) {
          await manager.update(
            GroupEntity,
            { id: oldest.id },
            { isDefault: true },
          );
        }
      }
    });
  }

  async addPokemon(
    userId: string,
    groupId: string,
    dto: AddGroupPokemonRequestDto,
  ): Promise<GroupPokemonEntity> {
    await this.findOneForUser(userId, groupId);

    await this.groupPokemonRepository
      .createQueryBuilder()
      .insert()
      .values({
        groupId,
        pokemonId: dto.pokemonId,
        speciesId: dto.speciesId,
      })
      .orIgnore()
      .execute();

    const groupPokemon = await this.groupPokemonRepository.findOne({
      where: { groupId, pokemonId: dto.pokemonId },
    });
    return groupPokemon!;
  }

  async removePokemon(
    userId: string,
    groupId: string,
    pokemonId: string,
  ): Promise<void> {
    await this.findOneForUser(userId, groupId);
    await this.groupPokemonRepository.delete({ groupId, pokemonId });
  }

  async findPokemonForGroup(
    userId: string,
    groupId: string,
  ): Promise<GroupPokemonEntity[]> {
    await this.findOneForUser(userId, groupId);
    return this.groupPokemonRepository.find({
      where: { groupId },
      order: { createdAt: 'ASC' },
    });
  }

  async findAllMembershipsForUser(
    userId: string,
  ): Promise<GroupPokemonEntity[]> {
    return this.groupPokemonRepository
      .createQueryBuilder('group_pokemon')
      .innerJoin('group_pokemon.group', 'group')
      .where('group.userId = :userId', { userId })
      .select([
        'group_pokemon.id',
        'group_pokemon.groupId',
        'group_pokemon.pokemonId',
      ])
      .orderBy('group_pokemon.createdAt', 'ASC')
      .getMany();
  }
}
