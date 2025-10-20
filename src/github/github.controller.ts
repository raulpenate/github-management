import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { GithubService } from './github.service';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('invite')
  async invite(@Body() inviteUserDto: InviteUserDto) {
    return this.githubService.inviteUser(inviteUserDto.identifier);
  }

  @Delete('members/:identifier')
  async removeUser(@Param('identifier') identifier: string) {
    return this.githubService.removeUser(identifier);
  }
}
