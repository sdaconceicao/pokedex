import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAvatarEntity } from './user-avatar.entity';
import { AvatarMimeType } from './validation/avatar.validation';

/**
 * Kept apart from `UsersService` deliberately: `AuthService` injects that one,
 * and the security-critical login path has no business carrying a dependency on
 * avatar storage.
 */
@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(UserAvatarEntity)
    private avatarsRepository: Repository<UserAvatarEntity>,
  ) {}

  /**
   * Replaces any existing avatar. `userId` is the primary key, so a plain save
   * is the upsert — no read-then-branch, and no way to end up with two rows.
   *
   * `data` is trusted to have been checked by `resolveAvatarMimeType` and
   * `isAvatarWithinSizeLimit` already; the DB's CHECK constraints are the
   * backstop if it was not.
   */
  async upsert(
    userId: string,
    mimeType: AvatarMimeType,
    data: Buffer,
  ): Promise<UserAvatarEntity> {
    return this.avatarsRepository.save({ userId, mimeType, data });
  }

  async findOneByUserId(userId: string): Promise<UserAvatarEntity | null> {
    return this.avatarsRepository.findOne({ where: { userId } });
  }

  async remove(userId: string): Promise<boolean> {
    const result = await this.avatarsRepository.delete({ userId });
    return (result.affected ?? 0) > 0;
  }
}
