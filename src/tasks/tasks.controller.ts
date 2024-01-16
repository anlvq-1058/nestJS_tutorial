import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDtoTs } from './dto/create-task.dto.ts/create-task.dto.ts';
import { Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  private readonly logger = new Logger(TasksController.name);

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDtoTs): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
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
    @Body('status') taskStatus: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, taskStatus);
  }

  @Get()
  getTasks(@Query() filterTaskDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterTaskDto).length) {
      return this.tasksService.getTasksWithFilters(filterTaskDto);
    }

    return this.tasksService.getAllTasks();
  }
}
