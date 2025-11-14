import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.id) return false;

    const wsId = request.params.wsId;
    const chId = request.params.chId;

    // fetch roles fresh from DB
    const { wsRoles, channelRoles } = await this.userService.getUserRoles(
      user.id,
    );

    if (wsId) {
      const roleInWS = wsRoles?.find((r) => r.workspaceId === wsId)?.role;
      if (roleInWS && requiredRoles.includes(roleInWS)) return true;
    }

    if (chId) {
      const roleInChannel = channelRoles?.find(
        (r) => r.channelId === chId,
      )?.role;
      if (roleInChannel && requiredRoles.includes(roleInChannel)) return true;
    }

    return false;
  }
}
