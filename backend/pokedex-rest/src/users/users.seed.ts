import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserEntity } from './users.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(UserEntity);

    const existingUser = await repository.findOne({
      where: { email: 'test@test.com' },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Test@Password123', 10);

      await repository.insert({
        email: 'test@test.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        // Verified so the e2e login fixture works; real accounts start false.
        emailVerified: true,
      });
      console.log('Test user created successfully');
    } else {
      // The fixture predates emailVerified on any existing database, so
      // ensure it rather than only inserting it — tests/auth/login.spec.ts
      // signs in as this user and verification is now enforced.
      if (!existingUser.emailVerified) {
        await repository.update(existingUser.id, { emailVerified: true });
        console.log('Test user marked email-verified');
      } else {
        console.log('Test user already exists');
      }
    }
  }
}
