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
      });
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }
  }
}
