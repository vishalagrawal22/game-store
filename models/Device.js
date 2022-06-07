import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
});

deviceSchema.virtual("url").get(function () {
  return "/devices/" + this._id;
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
