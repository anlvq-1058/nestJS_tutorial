import { v4 as uuid4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task as TaskEntity } from './entities/task.entity';
import { User } from '../auth/entities/auth.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
    private readonly i18n: I18nService,
  ) {}

  async getAllTasks(): Promise<TaskEntity[]> {
    return await this.tasksRepository.find();
  }

  async createTask(
    CreateTaskDto: CreateTaskDtoTs,
    user: User,
  ): Promise<TaskEntity> {
    const { title, description } = CreateTaskDto;
    // this.logger.log(`User ${user.id} create a new task`);
    const task = this.tasksRepository.create({
      id: uuid4(),
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: user },
    });
    if (!task) {
      throw new NotFoundException(
        this.i18n.t('test.not_found', { lang: I18nContext.current().lang }),
      );
    }
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return task || null;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<TaskEntity> {
    const task: TaskEntity = await this.getTaskById(id, user);
    task.status = status;
    this.tasksRepository.save(task);
    return task;
  }

  async getTasksWithFilters(
    GetTasksFilterDto: GetTasksFilterDto,
  ): Promise<TaskEntity[]> {
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
