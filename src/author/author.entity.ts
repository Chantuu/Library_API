import { Book } from 'src/books/book.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No Biography Provided' })
  biography: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @ManyToOne(() => User, (user) => user.uploadedAuthors, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  uploadedBy?: User;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
