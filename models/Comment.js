import mongoose, { Schema, models } from 'mongoose';

const CommentSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;
