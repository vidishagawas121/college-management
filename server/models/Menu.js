const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  isExternal: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  children: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      isExternal: { type: Boolean, default: false },
      order: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    }
  ]
});

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: 'main-navigation',
    },
    items: [MenuItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Menu', MenuSchema);
