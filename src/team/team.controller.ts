import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/team')
@ApiTags('Team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('getTeamMembers/:id')
  getTeamMembers(@Param('id') id: string) {
    return this.teamService.getTeamMembers(id);
  }

  @Get('getTeamAttendence')
  getTeamAttendence(
    @Query('userId') userId?: string,
    @Query('attendenceDate') attendenceDate?: string,
  ) {
    return this.teamService.getTeamAttendence(+attendenceDate, userId);
  }

  @Get('getTeamReports')
  getTeamReports(
    @Query('userId') userId?: string,
    @Query('reportDate') reportDate?: string,
  ) {
    return this.teamService.getTeamReports(reportDate, userId);
  }

  @Get('getTeamProgress')
  getTeamProgress(
    @Query('userId') userId?: string,
    @Query('progressDate') progressDate?: string,
  ) {
    return this.teamService.getTeamProgress(progressDate, userId);
  }
}
