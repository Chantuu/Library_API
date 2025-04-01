import { Transform } from 'class-transformer';
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Transform(({ value }) => {
    // If User entity was specified in relationships
    if (value) {
      // Returns serialized User entity in response
      return {
        id: value.id,
        name: value.name,
        email: value.email,
      };
    }
  })
  uploadedBy: User;

  @ManyToOne(() => Author, (author) => author.books, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Transform(({ value }) => {
    // If User entity was specified in relationships
    if (value) {
      // Returns serialized Author entity in response
      return {
        id: value.id,
        name: value.name,
        biography: value.biography,
        birthDate: value.birthDate,
      };
    }
  })
  author: Author;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
