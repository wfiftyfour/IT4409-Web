import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { WorkspaceResponseDto } from './dtos/workspace-response.dto';
import { WorkspaceMemberListResponseDto } from './dtos/workspace-member-response.dto';
import { CreateWorkspaceJoinRequestDto } from './dtos/create-workspace-join-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../common/constants/roles.constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import type { File as MulterFile } from 'multer';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Create a new workspace with optional avatar file' })
  @ApiBody({ type: CreateWorkspaceDto })
  @ApiResponse({
    status: 201,
    description: 'Workspace successfully created',
    type: WorkspaceResponseDto,
  })
  async create(
    @Req() req,
    @Body() dto: CreateWorkspaceDto,
    @UploadedFile() avatar?: MulterFile,
  ): Promise<WorkspaceResponseDto> {
    let avatarUrl: string | undefined;

    if (avatar) {
      const uploadResult = await this.uploadService.uploadSingle(
        avatar,
        `workspace/temp`,
      );
      avatarUrl = uploadResult.url;
    }

    // Truyền DTO + avatarUrl xuống service
    return this.workspaceService.create(req.user.id, dto, avatarUrl);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all workspaces for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of workspaces',
    type: [WorkspaceResponseDto],
  })
  findAll(@Req() req): Promise<WorkspaceResponseDto[]> {
    return this.workspaceService.findAllByUser(req.user.id);
  }

  @Patch(':workspaceId')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(ROLES.WORKSPACE_ADMIN)
  @ApiOperation({ summary: 'Update a workspace (ADMIN only)' })
  @ApiParam({
    name: 'workspaceId',
    description: 'ID of the workspace to update',
  })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiResponse({
    status: 200,
    description: 'Workspace successfully updated',
    type: WorkspaceResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to update this workspace',
  })
  update(
    @Req() req,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    return this.workspaceService.update(req.user.id, workspaceId, dto);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.WORKSPACE_ADMIN)
  async getMembers(
    @Param('workspaceId') workspaceId: string,
    @Req() req,
  ): Promise<WorkspaceMemberListResponseDto> {
    return this.workspaceService.getMembers(workspaceId, req.user.id);
  }

  // Join workspace request
  @Post('join-requests')
  @UseGuards(JwtAuthGuard)
  async joinWorkspace(@Req() req, @Body() dto: CreateWorkspaceJoinRequestDto) {
    return this.workspaceService.joinWorkspace(req.user.id, dto.joinCode);
  }

  // Get join requests
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':workspaceId/join-requests')
  @Roles(ROLES.WORKSPACE_ADMIN)
  async getJoinRequest(@Param('workspaceId') workspaceId: string, @Req() req) {
    return this.workspaceService.getJoinRequests(workspaceId, req.user.id);
  }

  // Get workspace details
  @Get(':workspaceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.WORKSPACE_MEMBER, ROLES.WORKSPACE_ADMIN)
  @ApiOperation({ summary: 'Get workspace details by ID' })
  @ApiParam({ name: 'workspaceId', description: 'ID of the workspace' })
  @ApiResponse({
    status: 200,
    description: 'Workspace details',
    type: WorkspaceResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have access to this workspace',
  })
  findOne(
    @Req() req,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceResponseDto> {
    return this.workspaceService.findOne(req.user.id, workspaceId);
  }

  // Accept request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':workspaceId/join-requests/:requestId/accept')
  @Roles(ROLES.WORKSPACE_ADMIN)
  async accept(
    @Param('workspaceId') workspaceId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.workspaceService.acceptRequest(workspaceId, requestId);
  }

  // Reject request
  @Put(':workspaceId/join-requests/:requestId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.WORKSPACE_ADMIN)
  async reject(
    @Param('workspaceId') workspaceId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.workspaceService.rejectRequest(workspaceId, requestId);
  }
}
