const { Schema, model } = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  apiToken: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
},
{
  timestamps: true
});

userSchema.plugin(aggregatePaginate);
module.exports = model('User', userSchema);
