import { UserEntity } from '../user.entity.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity>;

  deleteById(id: string): Promise<UserEntity>;

  findFullEntityById(id: string): Promise<UserEntity>;
}
