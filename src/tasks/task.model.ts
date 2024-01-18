// import { User } from '../auth/entities/auth.entity';
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
