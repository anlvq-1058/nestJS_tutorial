import { User } from '../../auth/entities/auth.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('tasks')
export class Task {
  @Column()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'OPEN' })
  status: string;

  @PrimaryGeneratedColumn('increment')
  taskId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
