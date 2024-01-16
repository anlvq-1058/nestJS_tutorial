import { v4 as uuid4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task as TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  async createTask(CreateTaskDto: CreateTaskDtoTs): Promise<Task> {
    const { title, description } = CreateTaskDto;
    const taskParams: Task = {
      id: uuid4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    const task = await this.tasksRepository.create(taskParams);
    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  deleteTaskById(id: string): Promise<Task> {
    const task = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return task || null;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);
    task.status = status;
    this.tasksRepository.save(task);
    return task;
  }

  async getTasksWithFilters(
    GetTasksFilterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    // eslint-disable-next-line prefer-const
    let { status, searchString } = GetTasksFilterDto;
    let tasks = await this.getAllTasks();

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
