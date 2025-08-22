import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(UserEntity);

    // Check if user already exists
    const existingUser = await repository.findOne({
      where: { email: 'test@test.com' },
    });

    if (!existingUser) {
      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash('Test@Password123', 10);

      await repository.insert({
        email: 'test@test.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
      });
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }
  }
}
