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
        const configDataSourceOptions: DataSourceOptions = {
          type: 'mysql',
          //temporary (replace this with the config blow)
          host: 'mysql-db', //in same container(auth-app), host following container name of database that is configured in docker-compose.yml (mysql-db)
          //should use this
          // host:configService.get('MYSQL_HOST'),
          port: parseInt(configService.get('MYSQL_PORT')),
          username: configService.get('MYSQL_ROOT_USER'),
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
export class DatabaseModule { }
