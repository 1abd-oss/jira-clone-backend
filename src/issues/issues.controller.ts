import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('issues')
@UseGuards(AuthGuard('jwt'))
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(
    @Request() req,
    @Body()
    body: {
      title: string;
      description?: string;
      priority?: string;
      project: string;   // project ID
    }
  ) {
    return this.issuesService.create(body, req.user.userId);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.issuesService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.issuesService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.issuesService.updateStatus(id, body.status);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.issuesService.assign(id, body.userId);
  }

  @Patch(':id/comment')
  addComment(@Param('id') id: string, @Body() body: { comment: string }) {
    return this.issuesService.addComment(id, body.comment);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.issuesService.delete(id);
  }
}
