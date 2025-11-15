import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Request() req, @Body() body: { name: string; description?: string }) {
    return this.projectsService.create(body, req.user.sub); // FIXED
  }

  @Get()
  findAll(@Request() req) {
    return this.projectsService.findAllByUser(req.user.sub); // FIXED
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { name?: string; description?: string; status?: string }
  ) {
    return this.projectsService.update(id, req.user.sub, body); // FIXED
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.delete(id, req.user.sub); // FIXED
  }
}
