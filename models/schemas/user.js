const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, unique: true },
    hash: String,
    token: String,
    name: String,
    isAdmin: Boolean,
    address: String,
    classYear: Number,
    orders: [{
      items: [{
        itemId: String,
        quantity: Number,
        price: Number
      }],
      purchasedDate: Date,
      deliveredDate: Date,
      isPaid: Boolean
    }]
  },
  {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    },
  }
)

userSchema.pre('save', function(callback) {
  if (!this.email) {
    return callback(new Error('Missing email'))
  }
  if (!this.hash) {
    return callback(new Error('Missing hash'))
  }
  if (!this.name) {
    return callback(new Error('Missing name'))
  }
  if (this.isModified('hash')) {
    this.hash = bcrypt.hashSync(this.hash)
  }

  callback()
})

userSchema.methods.comparePassword = function(pw, callback) {
  bcrypt.compare(pw, this.hash, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User