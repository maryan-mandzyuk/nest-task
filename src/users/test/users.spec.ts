import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthHelper } from '../../auth/authHelper';
import { Repository } from 'typeorm';
import { USER_ROLES } from '../../constants';
import { UpdatePasswordUserDto } from '../dto/update-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../user.entity';
import { UsersService } from '../users.service';
import { UsersRepositoryFake } from './usersRepositoryFake';

const user: Users = {
  id: '1',
  userName: 'admin',
  email: 'mandzyuk.maryan@gmail.com',
  isEmailConfirmed: true,
  firstName: 'first name',
  lastName: 'last name',
  role: USER_ROLES.seller,
};

const id = '1';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepo: Repository<Users>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepositoryFake,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepo = moduleRef.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('Find user by id', () => {
    it('should invoke handleFindById from UsersService and return user', async () => {
      const findSpy = jest
        .spyOn(usersRepo, 'findOneOrFail')
        .mockResolvedValueOnce(user);

      const foundUser = await usersService.handleFindById(id);
      expect(findSpy).toBeCalledWith(id);
      expect(foundUser).toEqual(user);
    });
  });

  describe('Update user', () => {
    it('should invoke handleUserUpdate from UsersService and update and return user', async () => {
      const userDto: UpdateUserDto = {
        firstName: 'updatedFirst',
        lastName: 'updatedLast',
        userName: 'updatedUserName',
      };
      const updateUser = {
        ...user,
        ...userDto,
      };
      const findSpy = jest
        .spyOn(usersRepo, 'findOneOrFail')
        .mockResolvedValueOnce(user);
      const saveSpy = jest
        .spyOn(usersRepo, 'save')
        .mockResolvedValueOnce(updateUser);
      const updatedUser = await usersService.handleUserUpdate(id, userDto);

      expect(updatedUser).toEqual(updateUser);
      expect(findSpy).toHaveBeenCalledWith(id);
      expect(saveSpy).toHaveBeenCalledWith(updateUser);
    });
  });

  describe('handlePasswordUpdate', () => {
    it('When oldPassword and newPassword provided right, expect to update password of user', async () => {
      const userDto: UpdatePasswordUserDto = {
        newPassword: 'pass1',
        oldPassword: 'pass1',
      };
      const hashPass = await AuthHelper.hashPassword(userDto.newPassword);

      const createQueryBuilderSpy = jest
        .spyOn(usersRepo, 'findOneOrFail')
        .mockResolvedValue({ ...user, password: hashPass });
      const saveSpy = jest.spyOn(usersRepo, 'save').mockResolvedValueOnce(user);
      const updatedUser = await usersService.handlePasswordUpdate(id, userDto);

      expect(createQueryBuilderSpy).toBeCalledWith(id, {
        select: ['password'],
      });
      expect(saveSpy).toBeCalled();
      expect(updatedUser).toEqual(user);
    });
  });
});
