module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CommentSchema = new Schema({
    content: String,
    user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
  },{timestamps:{createdAt: 'create',updatedAt:'update'}});
  return mongoose.model('Comment', CommentSchema);
}