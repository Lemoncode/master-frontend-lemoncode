import mongoose, { Document, Schema } from 'mongoose';
import { Member } from './member.model';

const memberSchema = new Schema({
  avatarUrl: { type: Schema.Types.String, required: true },
  login: { type: Schema.Types.String, required: true },
  organization: { type: Schema.Types.String, required: true },
});

export const MemberContext = mongoose.model<Member & Document>(
  'Member',
  memberSchema
);
