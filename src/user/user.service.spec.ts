jest.mock('./user.entity', () => ({ UserEntity: class {} }));
jest.mock('@app/config', () => ({ JWT_SECRET: 'test', salt: 'salt' }), { virtual: true });
jest.mock('@app/utils/createHashWithSalt', () => ({ createHashWithSalt: () => '' }), { virtual: true });

import { UserService } from './user.service';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: Partial<Repository<any>>;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn().mockImplementation(async ({ where }) => {
        if (where.email) {
          return null; // no user with provided email
        }
        if (where.username) {
          return { id: 1, username: where.username }; // username already taken
        }
        return null;
      }),
      save: jest.fn()
    };

    userService = new UserService(mockUserRepository as Repository<any>);
  });

  it('should report username as taken when duplicate username exists', async () => {
    const dto = { email: 'test@example.com', username: 'taken', password: '123' };
    await expect(userService.createUser(dto)).rejects.toMatchObject({
      response: {
        errors: { username: 'has already been taken' }
      }
    });
  });
});
