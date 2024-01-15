import { IsNotEmpty } from 'class-validator';

export class CreateTaskDtoTs {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
