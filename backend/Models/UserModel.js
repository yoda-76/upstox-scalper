const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// {
//   username: String,
//   email: String,
//   password: String,
//   name: String,
//   funds: Object,
//   watchlist: Object,
//   orderbook: Object,
//   positions:Object,
//   holdings: Object,
//   bids: Object
// }
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  key:{type: String},
  secret:{type: String},
  lastTokenGeneratedAt:String,
  funds: Object,
  watchlist: Object,
  orderbook: Object,
  positions:Object,
  holdings: Object,
  bids: Object,
  data:Object
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);