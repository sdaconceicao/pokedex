import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupEntity } from './groups.entity';

@Entity('group_pokemon', { schema: 'users' })
export class GroupPokemonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'varchar', length: 64 })
  pokemonId: string;

  @Column({ type: 'varchar', length: 64 })
  speciesId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(
    () => GroupEntity,
    (group) => group.pokemon,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'groupId' })
  group: GroupEntity;
}
