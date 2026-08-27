import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  // Consecutive wrong current-password attempts. Reset on success, and the
  // basis of the lockout window below.
  @Column({ type: 'smallint', default: 0 })
  failedPasswordAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  passwordLockedUntil: Date | null;
}
