import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  user: {
    // type: Schema.Types.ObjectId,
    type:String,
    // ref: 'User',
    required: true
  },
  tokennumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  Expire: {
    type: Boolean,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);
export default Token