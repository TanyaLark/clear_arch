import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hashUserPassword } from '../../helpers/encryption/hash-user-password.js';
import { ArticleEntity } from '../article/article.entity.js';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hashUserPassword(this.password);
    }
  }
}
