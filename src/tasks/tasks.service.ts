import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private readonly logger = new Logger(TasksService.name);

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(CreateTaskDto: CreateTaskDtoTs): Task {
    const { title, description } = CreateTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  deleteTaskById(id: string): Task {
    const task = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return task || null;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  getTasksWithFilters(GetTasksFilterDto: GetTasksFilterDto): Task[] {
    // eslint-disable-next-line prefer-const
    let { status, searchString } = GetTasksFilterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (searchString) {
      searchString = searchString.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchString) ||
          task.description.toLowerCase().includes(searchString),
      );
    }

    return tasks;
  }
}
