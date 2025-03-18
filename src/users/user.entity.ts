import { Author } from 'src/author/author.entity';
import { Book } from 'src/books/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: 'user',
  })
  role: 'user' | 'admin';

  @OneToMany(() => Book, (book) => book.uploadedBy)
  uploadedBooks: Book[];

  @OneToMany(() => Author, (author) => author.uploadedBy)
  uploadedAuthors: Author[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
