import Category from "../models/Category.js";

export function categoryList(req, res, next) {
  Category.find({}, (err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("category-list", { categories });
  });
}

export function categoryDetail(req, res) {
  res.send("Not Implemented: Category Detail");
}

export function getCategoryCreate(req, res) {
  res.send("Not Implemented: Get Category Create");
}

export function postCategoryCreate(req, res) {
  res.send("Not Implemented: Post Category Create");
}

export function getCategoryUpdate(req, res) {
  res.send("Not Implemented: GET Category Update");
}

export function postCategoryUpdate(req, res) {
  res.send("Not Implemented: POST Category Update");
}

export function getCategoryDelete(req, res) {
  res.send("Not Implemented: GET Category Delete");
}

export function postCategoryDelete(req, res) {
  res.send("Not Implemented: POST Category Delete");
}
