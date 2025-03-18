import { Author } from 'src/authors/author.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  publishedYear: number;

  @Column({ default: 'No Description ' })
  description: string;

  @ManyToOne(() => User, (user) => user.uploadedBooks, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  uploadedBy?: User;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
