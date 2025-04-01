import { Transform } from 'class-transformer';
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

  @Column()
  name: string;

  @Column({ default: 'No Biography Provided' })
  biography: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @ManyToOne(() => User, (user) => user.uploadedAuthors, {
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

  @OneToMany(() => Book, (book) => book.author)
  @Transform(({ value }) => {
    const transformedBooks: Partial<Book>[] = [];
    // If Book entity was specified in relationships
    if (value) {
      // Loops through every Book entity
      for (let book of value) {
        // Adds serialized Book entities in array
        transformedBooks.push({
          id: book.id,
          title: book.title,
          genre: book.genre,
          publishedYear: book.publishedYear,
          description: book.description,
        });
      }

      // Returns serialized Books array
      return transformedBooks;
    }
  })
  books: Book[];

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
