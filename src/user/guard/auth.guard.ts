import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from '../decorator/role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from the handler/controller
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Extract token from header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // DEBUG: Uncomment to verify what's being checked
      // console.log('User Role:', payload.role);
      // console.log('Required Roles:', requiredRoles);

      // Grant access if user has the required role
      if (requiredRoles.includes(payload.role)) {
        request.user = payload;
        return true;
      }

      // Special case: If user is admin, grant access regardless
      if (payload.role.toLowerCase() === 'admin') {
        request.user = payload;
        return true;
      }

      // If we get here, access is denied
      throw new UnauthorizedException('Insufficient permissions');
    } catch (error) {
      throw new UnauthorizedException('Invalid token or permissions');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}