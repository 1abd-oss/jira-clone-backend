import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './projects.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async create(data: Partial<Project>, userId: string) {
    // Convert ID to ObjectId (required)
    const userObjectId = new Types.ObjectId(userId);

    const project = new this.projectModel({
      ...data,
      owner: userObjectId,             // ✔ ALWAYS ObjectId
      members: [userObjectId],         // ✔ owner is also member
    });

    return project.save();
  }

 async findAllByUser(userId: string) {
  const userObjectId = new Types.ObjectId(userId);

  return this.projectModel
    .find({
      $or: [
        { owner: userObjectId },
        { members: userObjectId }
      ]
    })
    .populate("owner", "email")
    .populate("members", "email");
}


  async findById(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('owner', 'email')
      .populate('members', 'email');

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, userId: string, updateData: Partial<Project>) {
    const project = await this.projectModel.findById(id);

    if (!project) throw new NotFoundException('Project not found');

    if (project.owner.toString() !== userId)
      throw new ForbiddenException('Only the owner can update this project');

    Object.assign(project, updateData);
    return project.save();
  }

  async delete(id: string, userId: string) {
    const project = await this.projectModel.findById(id);

    if (!project) throw new NotFoundException('Project not found');

    if (project.owner.toString() !== userId)
      throw new ForbiddenException('Only the owner can delete this project');

    await this.projectModel.findByIdAndDelete(id);
    return { message: 'Project deleted successfully' };
  }
}
