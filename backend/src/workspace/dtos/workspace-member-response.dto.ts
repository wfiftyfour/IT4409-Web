export class WorkspaceMemberResponseDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  joinedAt: Date;
}

export class WorkspaceMemberListResponseDto {
  members: WorkspaceMemberResponseDto[];
  totalCount: number;
  myRole: string;
}
