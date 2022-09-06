import { Body, Controller, Inject, Post, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { User } from '../user.entity';

// Auth controller provides the authentication endpoints for the application.
@Controller('auth')
export class AuthController {

    @Inject(AuthService)
    private readonly service: AuthService;

    // User registration endpoint.
    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    private register(@Body() body: RegisterDto): Promise<User | never> {
        return this.service.register(body);
    }

    // User login endpoint.
    @Post('login')
    @UseInterceptors(ClassSerializerInterceptor)
    private login(@Body() body: LoginDto): Promise<{} | never> {
        return this.service.login(body);
    }

    // Token verification endpoint.
    @Post('verify-token')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    private verifyToken(@Req() { user }: Request): Promise<{} | never> {
        return this.service.verifyToken(<User>user);
    }

    // Refresh token endpoint.
    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    private refresh(@Req() { user }: Request): Promise<string | never> {
        return this.service.refresh(<User>user);
    }
}