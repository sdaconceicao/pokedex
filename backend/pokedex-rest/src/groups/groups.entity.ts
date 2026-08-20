import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupPokemonEntity } from './group-pokemon.entity';

@Entity('groups', { schema: 'users' })
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(
    () => GroupPokemonEntity,
    (groupPokemon) => groupPokemon.group,
  )
  pokemon: GroupPokemonEntity[];

  // Populated by findAllForUser's grouped count query; not a column.
  pokemonCount?: number;
}
