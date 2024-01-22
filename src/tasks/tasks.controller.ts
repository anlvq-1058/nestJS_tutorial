import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/auth.entity';
import { Request } from 'express';
import { Task as TaskEntity } from './entities/task.entity';

@Controller('tasks')
@UseGuards(AuthGuard()) // AuthGuard('jwt')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  private readonly logger = new Logger(TasksController.name);

  async getAllTasks(): Promise<TaskEntity[]> {
    return await this.tasksService.getAllTasks();
  }

  @UsePipes(ValidationPipe)
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDtoTs,
    @Req() req: Request,
  ): Promise<TaskEntity> {
    this.logger.verbose(`${JSON.stringify(req.user)}`);
    return this.tasksService.createTask(createTaskDto, req.user as User);
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  getTaskById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, req.user as User);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @Req() req: Request): string {
    const taskDeleted = this.tasksService.deleteTaskById(id, req.user as User);

    if (!taskDeleted) {
      return 'Somgthing went wrong when delete task!';
    }

    return `Task ${id} was deleted!`;
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) taskStatus: TaskStatus,
    @Req() req: Request,
  ): Promise<TaskEntity> {
    return this.tasksService.updateTaskStatus(id, taskStatus, req.user as User);
  }

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterTaskDto: GetTasksFilterDto,
    @Req() req: Request,
  ): Promise<TaskEntity[]> {
    this.logger.verbose(`abc ${JSON.stringify(req.user)}`);
    this.logger.verbose(`${JSON.stringify(filterTaskDto)}`);
    if (Object.keys(filterTaskDto).length) {
      return this.tasksService.getTasksWithFilters(filterTaskDto);
    }

    return this.tasksService.getAllTasks();
  }
}
