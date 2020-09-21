const formidable = require(`formidable`);
const _ = require(`lodash`);
const fs = require(`fs`);
const Product = require(`../models/product`);
const { errorHandler } = require(`../helpers/dbErrorHandler`);

// check for error and send barring product not found
exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });
};

// send everything but the photo for quick response
exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // check for all fields
        const {name, description, category, price, quantity, shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required"
            })
        }


         // create new product
        let product = new Product(fields);

        // check size of photo is within bounds and if so add photo to product
        // 1kB = 1000
        // 1mB = 1000000
        if(files.photo){
            //console.log("FILES PHOTO: ", files.photo);
            if(files.photo.size > 2000000){
                return res.status(400).json({
                    error: "Image should not exceed 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        // barring errors , save product information in json format in database
        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            "message": "product successfully deleted"
        })
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // check for all fields
        // const {name, description, category, price, quantity, shipping} = fields;
        // if(!name || !description || !price || !category || !quantity || !shipping){
        //     return res.status(400).json({
        //         error: "All fields are required"
        //     })
        // }


        // create new product
        let product = req.product;
        product = _.extend(product, fields);

        // check size of photo is within bounds and if so add photo to product
        // 1kB = 1000
        // 1mB = 1000000
        if(files.photo){
            //console.log("FILES PHOTO: ", files.photo);
            if(files.photo.size > 2000000){
                return res.status(400).json({
                    error: "Image should not exceed 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        // barring errors , save product information in json format in database
        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
};

/* return most popular and new arrival
    by sell = /products?sortBy=sold&order=desc&limit=4
    by arrival = /products?sortBy=createdAt&order=desc&limit=4
    if no params are sent then all products are returned
*/


exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {
          if(err) {
              return res.status(400).json({
                  error: "Products not found"
              });
          }
          res.send(products);
      });
};

/*
* find products based on the req product category
* other products that have the same category will be returned
*/

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 15;
    // find related products excluding the primary product
    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        })
};


exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: "Categories not found"
            })
        }
        res.json(categories);
    })
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};


exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: {_id: item._id},
        update: {$inc: {quantity: -item.count, sold: +item.count}}
      }
    };
  });

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if(error) {
      return res.status(400).json({
        error: "Failed to update product quantity"
      });
    }
    next();
  });
};
