const Product = require("../models/Product");

const list = () => {
  return Product.find({})
    .populate({ //Icine obje alir, path ile field belirtilir ve select ile bu field doldurulur!!!
      path: "user_id", //Product da user_id, usere'a ref edilmis. 
      select: "first_name email", //Bu yuzden select ile user bilgilerine erisebiliyoruz.
    })
    .populate({
      path: "comments",
      populate: { //comments kendi basına bir ARRAY oldugu icin onu da populate ettik
        path: "user_id",
        select: "first_name",
      }, //Product icinedeki user_id ve comments kisimlarina bilgi eklendi.
    });
};

const insert = (data) => {
  return new Product(data).save();
};

 const findOne = (where) => {
  return Product.findOne(where);
};

const updateDoc = (docId, updateData) => {
  return Product.findByIdAndUpdate(docId, updateData, {new: true});
};

/*const deleteDoc = () => {

}; */

module.exports = {
  list,
  insert,
  findOne,
  updateDoc
};
