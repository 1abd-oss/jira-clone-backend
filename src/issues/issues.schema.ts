import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Issue extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    enum: ['todo', 'in_progress', 'in_review', 'done'],
    default: 'todo',
  })
  status: string;

  @Prop({
    enum: ['highest', 'high', 'medium', 'low', 'lowest'],
    default: 'medium',
  })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignee: Types.ObjectId;

  @Prop({ default: null })
  dueDate: string; // YYYY-MM-DD

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ default: null })
  sprint: string;

  @Prop({
    type: [{ body: String, createdAt: Date }],
    default: [],
  })
  comments: { body: string; createdAt: Date }[];
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
