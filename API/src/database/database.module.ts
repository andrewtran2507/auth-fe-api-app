import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('MYSQL CONFIG', {
        //   type: 'mysql',
        //   host: configService.get('MYSQL_HOST'),
        //   port: parseInt(configService.get('MYSQL_PORT')),
        //   username: configService.get('MYSQL_USER'),
        //   password: configService.get('MYSQL_PASSWORD'),
        //   database: configService.get('MYSQL_DB'),
        // });
        const configDataSourceOptions: DataSourceOptions = {
          type: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: parseInt(configService.get('MYSQL_PORT')),
          username: configService.get('MYSQL_USER'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DB'),
          // logging: 'all',// logging of all queries and errors
          synchronize: true,
          entities: [User],
        };
        return configDataSourceOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
