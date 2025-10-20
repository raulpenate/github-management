import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, Octokit } from 'octokit';

@Injectable()
export class GithubService implements OnModuleInit {
  private readonly logger = new Logger(GithubService.name);
  private octokit: Octokit;
  private readonly org: string;

  constructor(private configService: ConfigService) {
    this.org = this.configService.getOrThrow<string>('github.org');
  }

  onModuleInit() {
    this.loginGithubApp();
  }

  private async loginGithubApp() {
    const appId = this.configService.getOrThrow<string>('github.appId');
    const privateKey = this.configService.getOrThrow<string>('github.privateKey');
    const installationId = this.configService.getOrThrow<number>('github.installationId');

    const app = new App({
      appId,
      privateKey,
    });

    this.octokit = await app.getInstallationOctokit(installationId);
    this.logger.log('Successfully authenticated with GitHub App');
  }

  private isEmail(identifier: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
  }

  private async getUserId(username: string): Promise<number> {
    try {
      const { data } = await this.octokit.rest.users.getByUsername({ username });
      console.log(data);
      return data.id;
    } catch (error) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  }

  async checkMembership(username: string): Promise<boolean> {
    try {
      console.log(this.org, username);
      await this.octokit.rest.orgs.checkMembershipForUser({
        org: this.org,
        username,
      });
      return true;
    } catch (error) {
      throw new NotFoundException(`Failed to check membership for ${username}: ${error.message}`);
    }
  }

  async inviteUserByEmail(email: string): Promise<any> {
    try {
      const { data } = await this.octokit.rest.orgs.createInvitation({
        org: this.org,
        email,
        role: 'direct_member',
      });

      this.logger.log(`Successfully invited email ${email} to organization`);

      return {
        success: true,
        message: `An invitation has been sent to ${email} for organization`,
        invitation: {
          id: data.id,
          email: data.email,
          role: data.role,
          created_at: data.created_at,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to invite email ${email}: ${error.message}`);
    }
  }

  async inviteUserByUsername(username: string): Promise<any> {
    // TODO: Commented for now because when checked it fails
    //const isMember = await this.checkMembership(username);
    // if (isMember) {
    //  throw new ConflictException(`User ${username} is already member of organization ${this.org}`);
    // }

    try {
      const { data } = await this.octokit.rest.orgs.createInvitation({
        org: this.org,
        invitee_id: await this.getUserId(username),
        role: 'direct_member',
      });

      this.logger.log(`Successfully invited user ${username} to organization ${this.org}`);

      return {
        success: true,
        message: `User ${username} has been invited to organization ${this.org}`,
        invitation: {
          id: data.id,
          login: data.login,
          email: data.email,
          role: data.role,
          created_at: data.created_at,
        },
      };
    } catch (error) {}
  }

  async inviteUser(identifier: string): Promise<any> {
    if (this.isEmail(identifier)) {
      return this.inviteUserByEmail(identifier);
    } else {
      return this.inviteUserByUsername(identifier);
    }
  }

  async removeUser(identifier: string): Promise<any> {
    let username = identifier;

    if (this.isEmail(identifier)) {
      throw new BadRequestException(
        'Removing by email is not supported. Please provide GitHub username',
      );
    }

    const isMember = await this.checkMembership(username);
    if (!isMember) {
      throw new NotFoundException(`User ${username} is not a member of organization ${this.org}`);
    }

    try {
      await this.octokit.rest.orgs.removeMembershipForUser({
        org: this.org,
        username,
      });
    } catch (error) {
      this.logger.error(`Failed to remove user ${username}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to remove ${username}: ${error.message}`);
    }
  }
}
