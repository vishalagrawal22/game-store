import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: String,
  imageURL: { type: String, default: "/images/default-game-image.png" },
  price: { type: Number, min: 0, default: 0 },
  quantity: { type: Number, min: 0, default: 0 },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  ageRating: {
    type: String,
    required: true,
    enum: ["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"],
  },
  supportedDevices: [{ type: Schema.Types.ObjectId, ref: "Device" }],
});

gameSchema.virtual("url").get(function () {
  return "/games/" + this._id;
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
