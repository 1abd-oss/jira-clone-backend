import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Issue } from './issues.schema';

@Injectable()
export class IssuesService {
  constructor(@InjectModel(Issue.name) private issueModel: Model<Issue>) {}

  /** -----------------------------
   *  CREATE NEW ISSUE (Jira-style)
   *  ----------------------------- */
  async create(
    data: {
      title: string;
      description?: string;
      priority?: string;
      project: string;
      dueDate?: string;
      sprint?: string;
      labels?: string[];
    },
    reporterId: string,
  ) {
    const issue = new this.issueModel({
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'todo', // default column
      project: new Types.ObjectId(data.project),
      reporter: new Types.ObjectId(reporterId),
      assignee: null,
      dueDate: data.dueDate || null,
      sprint: data.sprint || null,
      labels: data.labels || [],
    });

    return issue.save();
  }

  /** -----------------------------
   *  FIND ALL ISSUES IN A PROJECT
   *  ----------------------------- */
  async findByProject(projectId: string) {
    return this.issueModel
      .find({ project: projectId })
      .populate('reporter', 'email')
      .populate('assignee', 'email');
  }

  /** -----------------------------
   *  FIND SINGLE ISSUE BY ID
   *  ----------------------------- */
  async findOne(id: string) {
    const issue = await this.issueModel
      .findById(id)
      .populate('reporter', 'email')
      .populate('assignee', 'email');

    if (!issue) throw new NotFoundException('Issue not found');
    return issue;
  }

  /** -----------------------------
   *  UPDATE ANY FIELDS
   *  ----------------------------- */
  async update(id: string, data: any) {
    const issue = await this.issueModel.findByIdAndUpdate(id, data, { new: true });
    if (!issue) throw new NotFoundException('Issue not found');
    return issue;
  }

  /** -----------------------------
   *  UPDATE ONLY STATUS (drag & drop)
   *  ----------------------------- */
  async updateStatus(id: string, status: string) {
    const issue = await this.issueModel.findById(id);
    if (!issue) throw new NotFoundException('Issue not found');

    issue.status = status;
    return issue.save();
  }

  /** -----------------------------
   *  ASSIGN ISSUE TO USER
   *  ----------------------------- */
  async assign(id: string, userId: string) {
    const issue = await this.issueModel.findById(id);
    if (!issue) throw new NotFoundException('Issue not found');

    issue.assignee = new Types.ObjectId(userId);
    return issue.save();
  }

  /** -----------------------------
   *  ADD COMMENT
   *  ----------------------------- */
  async addComment(id: string, comment: string) {
    const issue = await this.issueModel.findById(id);
    if (!issue) throw new NotFoundException('Issue not found');

    issue.comments.push({
      body: comment,
      createdAt: new Date(),
    });

    return issue.save();
  }

  /** -----------------------------
   *  DELETE ISSUE
   *  ----------------------------- */
  async delete(id: string) {
    const issue = await this.issueModel.findById(id);
    if (!issue) throw new NotFoundException('Issue not found');

    await this.issueModel.findByIdAndDelete(id);
    return { message: 'Issue deleted successfully' };
  }
}
