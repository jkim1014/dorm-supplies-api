const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: { type: String, unique: true },
    price: Number,
    description: String,
    quantity: Number,
    pic: String
  },
  {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    },
  }
)

const Item = mongoose.model('Item', itemSchema)

module.exports = Item