import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_avatars', { schema: 'users' })
export class UserAvatarEntity {
  // The FK is the PK — see the migration. No relation decorator, matching
  // GroupEntity, which also carries `userId` as a plain column with the
  // constraint enforced in SQL.
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 32 })
  mimeType: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
