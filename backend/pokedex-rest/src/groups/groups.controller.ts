import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import type { AccessTokenPayload } from '../auth/types/AccessTokenPayload';
import { AddGroupPokemonRequestDto } from './dtos/add-group-pokemon-request.dto';
import { CreateGroupRequestDto } from './dtos/create-group-request.dto';
import { GroupMembershipResponseDto } from './dtos/group-membership-response.dto';
import { GroupPokemonResponseDto } from './dtos/group-pokemon-response.dto';
import { GroupResponseDto } from './dtos/group-response.dto';
import { UpdateGroupRequestDto } from './dtos/update-group-request.dto';
import { GroupPokemonEntity } from './group-pokemon.entity';
import { GroupEntity } from './groups.entity';
import { GroupsService } from './groups.service';
import { GroupPokemonRequestPipe } from './validation/group-pokemon-request.pipe';
import { GroupRequestPipe } from './validation/group-request.pipe';

function toGroupResponse(group: GroupEntity): GroupResponseDto {
  return {
    id: group.id,
    name: group.name,
    isDefault: group.isDefault,
    pokemonCount: group.pokemonCount ?? 0,
  };
}

function toGroupPokemonResponse(
  groupPokemon: GroupPokemonEntity,
): GroupPokemonResponseDto {
  return {
    pokemonId: groupPokemon.pokemonId,
    speciesId: groupPokemon.speciesId,
  };
}

function toGroupMembershipResponse(
  groupPokemon: GroupPokemonEntity,
): GroupMembershipResponseDto {
  return {
    groupId: groupPokemon.groupId,
    pokemonId: groupPokemon.pokemonId,
  };
}

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: "List the current user's Pokemon groups" })
  @ApiOkResponse({ type: GroupResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async findAll(@User() user: AccessTokenPayload): Promise<GroupResponseDto[]> {
    const groups = await this.groupsService.findAllForUser(user.userId);
    return groups.map(toGroupResponse);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Pokemon group' })
  @ApiCreatedResponse({ type: GroupResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async create(
    @User() user: AccessTokenPayload,
    @Body(new GroupRequestPipe(true)) dto: CreateGroupRequestDto,
  ): Promise<GroupResponseDto> {
    const group = await this.groupsService.create(user.userId, dto);
    return toGroupResponse(group);
  }

  // Declared before the :id routes below: /groups/memberships must not be
  // swallowed as a GET /groups/:id if that route is ever added later.
  @Get('memberships')
  @ApiOperation({
    summary: "List every group/Pokemon pair across the user's groups",
  })
  @ApiOkResponse({ type: GroupMembershipResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async findAllMemberships(
    @User() user: AccessTokenPayload,
  ): Promise<GroupMembershipResponseDto[]> {
    const memberships = await this.groupsService.findAllMembershipsForUser(
      user.userId,
    );
    return memberships.map(toGroupMembershipResponse);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a group or set it as the default' })
  @ApiOkResponse({ type: GroupResponseDto })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async update(
    @User() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body(new GroupRequestPipe(false)) dto: UpdateGroupRequestDto,
  ): Promise<GroupResponseDto> {
    const group = await this.groupsService.update(user.userId, id, dto);
    return toGroupResponse(group);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async remove(
    @User() user: AccessTokenPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.groupsService.remove(user.userId, id);
  }

  @Get(':id/pokemon')
  @ApiOperation({ summary: 'List the Pokemon saved in a group' })
  @ApiOkResponse({ type: GroupPokemonResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async findPokemon(
    @User() user: AccessTokenPayload,
    @Param('id') id: string,
  ): Promise<GroupPokemonResponseDto[]> {
    const pokemon = await this.groupsService.findPokemonForGroup(
      user.userId,
      id,
    );
    return pokemon.map(toGroupPokemonResponse);
  }

  @Post(':id/pokemon')
  @ApiOperation({ summary: 'Add a Pokemon to a group' })
  @ApiCreatedResponse({ type: GroupPokemonResponseDto })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async addPokemon(
    @User() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body(new GroupPokemonRequestPipe()) dto: AddGroupPokemonRequestDto,
  ): Promise<GroupPokemonResponseDto> {
    const groupPokemon = await this.groupsService.addPokemon(
      user.userId,
      id,
      dto,
    );
    return toGroupPokemonResponse(groupPokemon);
  }

  @Delete(':id/pokemon/:pokemonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a Pokemon from a group' })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async removePokemon(
    @User() user: AccessTokenPayload,
    @Param('id') id: string,
    @Param('pokemonId') pokemonId: string,
  ): Promise<void> {
    await this.groupsService.removePokemon(user.userId, id, pokemonId);
  }
}
