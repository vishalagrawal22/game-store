import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: String,
});

categorySchema.virtual("url").get(function () {
  return "/categories/" + this._id;
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
