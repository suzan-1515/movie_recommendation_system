import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get<string>('MYSQL_HOST'),
      port: this.config.get<number>('MYSQL_PORT'),
      database: this.config.get<string>('MYSQL_DATABASE'),
      username: this.config.get<string>('MYSQL_USERNAME'),
      password: this.config.get<string>('MYSQL_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: this.config.get<string>('NODE_ENV') != "production", // never use TRUE in production!
    };
  }
}