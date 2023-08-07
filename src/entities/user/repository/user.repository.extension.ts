import { UserEntity } from '../user.entity.js';
import { IUserRepository } from './user.repository-extension.interface.js';

export const userCustomRepositoryExtension: IUserRepository = {
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.findOne({ where: { email } });
  },

  async deleteById(id: string): Promise<UserEntity> {
    const userToDelete = await this.findOne({ where: { id } });
    return await this.remove(userToDelete);
  },

  async findFullEntityById(id: string): Promise<UserEntity> {
    return await this.findOne({ where: { id }, relations: ['articles'] });
  },
};
