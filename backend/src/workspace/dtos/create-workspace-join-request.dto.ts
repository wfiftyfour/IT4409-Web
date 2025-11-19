import { IsString } from 'class-validator';

export class CreateWorkspaceJoinRequestDto {
  @IsString()
  joinCode: string;
}
