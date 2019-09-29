module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    phone: { type: String  },
    nickname: { type: String, maxlength: 20 },
    avatar: String,
    bgurl:String,
    desc: { type: String, maxlength: 20 ,default:''},
    gender:String,
    update: { type: Date, default: Date.now },
    create: { type: Date, default: Date.now },
  },{timestamps:{createdAt: 'create',updatedAt:'update'}});
  return mongoose.model('User', UserSchema);
}