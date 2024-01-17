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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard()) // AuthGuard('jwt')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  private readonly logger = new Logger(TasksController.name);

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksService.getAllTasks();
  }

  @UsePipes(ValidationPipe)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDtoTs): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): string {
    const taskDeleted = this.tasksService.deleteTaskById(id);

    if (!taskDeleted) {
      return 'Somgthing went wrong when delete task!';
    }

    return `Task ${id} was deleted!`;
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) taskStatus: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, taskStatus);
  }

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterTaskDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    this.logger.verbose(`${JSON.stringify(filterTaskDto)}`);
    if (Object.keys(filterTaskDto).length) {
      return this.tasksService.getTasksWithFilters(filterTaskDto);
    }

    return this.tasksService.getAllTasks();
  }
}
