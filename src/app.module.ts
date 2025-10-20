import { Module } from '@nestjs/common';
import { GithubService } from './github/github.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    GithubModule,
  ],
  providers: [GithubService],
})
export class AppModule {}
