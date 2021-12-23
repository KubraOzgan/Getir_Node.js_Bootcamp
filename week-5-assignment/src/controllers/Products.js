const hs = require("http-status");
const { list, insert, findOne, updateDoc } = require("../services/Products");
const { checkSecureFile } = require("../scripts/utils/helper");
const path = require("path");

const index = (req, res) => {
  list()
    .then((itemList) => {
      if (!itemList)
        res.status(hs.INTERNAL_SERVER_ERROR).send({ error: "Not completed." });
      res.status(hs.OK).send(itemList);
    })
    .catch((e) => res.status(hs.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  req.body.user_id = req.user; 
  insert(req.body)
    .then((createdDoc) => {
      if (!createdDoc)
        res.status(hs.INTERNAL_SERVER_ERROR).send({ error: "Not completed." });
      res.status(hs.OK).send(createdDoc);
    })
    .catch((e) => res.status(hs.INTERNAL_SERVER_ERROR).send(e));
};

const update = (req, res) => {
  if(!req.params.id){
    return res.status(hs.BAD_REQUEST).send({ message: "Missing information." });
  }
  updateDoc(req.params.id, req.body)
  .then(updatedDoc => {
    if (!updatedDoc) {
      return res.status(hs.NOT_FOUND).send({ message: "Not found!" });
    }
    res.status(hs.OK).send(updatedDoc);
  })
  .catch((e) => {
    res.status(hs.INTERNAL_SERVER_ERROR).send(e);
  });
    
};

const addComment = (req, res) => {
  if(!req.params.id){
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Missing information."});
  }
  findOne({_id: req.params.id}) 
  .then((mainProduct) => {
    if(!mainProduct) {
      return res.status(hs.NOT_FOUND).send({ message: "Not found!"});
    }
    const comment = {
      ...req.body,
      created_at: new Date(),
      user_id: req.user, 
    };
    mainProduct.comments.push(comment);
    updateDoc(req.params.id, mainProduct) //2.yol : mainProduct.save().then()... response dondurdugumuz icin bunu tercih etmedik.
      .then((updatedDoc) => {
        if(!updatedDoc) {
          return res.status(hs.NOT_FOUND).send({ message: "Not found!"});
        }
        res.status(hs.OK).send(updatedDoc);
      })
      .catch((e) => {
        res.status(hs.INTERNAL_SERVER_ERROR).send(e);
      });
  });
    
};

const addMedia = (req, res) => { //express-fileupload ile eklenen filelar req.files ile set edilir. Yani file i req.files icinde bir obje olarak verir. 
    if(!req.params.id || !req.files?.file || !checkSecureFile(req?.files?.file?.mimetype)) { //Ya da dosya tipi FALSE donerse
      return res.status(hs.BAD_REQUEST).send({ message: "Missing information."});
    }
    findOne({ _id: req.params.id })
      .then((mainProduct)  => {
        if(!mainProduct) {
          res.status(hs.NOT_FOUND).send({ message: "Not found!"});
        }
        const extension = path.extname(req.files.file.name); 
        const fileName = `${mainProduct._id?.toString()}${extension}`; 
        const folderPath = path.join(__dirname, "../", "uploads/products", fileName); 

        //req'de files isimli bir kisim, onun icinde de file isimli key/property var. Onun icinde de mv var.
        req.files.file.mv(folderPath, function(err) { //file icinde "mv" isimli bir function var ve data burada tutuluyor. Yni mv yi kullanarak file i istedigimiz foldera aktarabiliriz.
          if(err) {
            return res.status(hs.INTERNAL_SERVER_ERROR).send(err);
          }
          mainProduct.media = fileName; 
          updateDoc(req.params.id, mainProduct) 
            .then((updatedDoc) => {
              if(!updatedDoc) {
                return res.status(hs.NOT_FOUND).send({ message: "Not found!"});
              }
              res.status(hs.OK).send(updatedDoc);
            })
            .catch((e) => {
              res.status(hs.INTERNAL_SERVER_ERROR).send(e);
            });
        });
      });
};

module.exports = {
  index,
  create,
  findOne,
  update,
  addComment,
  addMedia,
};
