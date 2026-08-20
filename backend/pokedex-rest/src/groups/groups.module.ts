import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPokemonEntity } from './group-pokemon.entity';
import { GroupsController } from './groups.controller';
import { GroupEntity } from './groups.entity';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupPokemonEntity])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
