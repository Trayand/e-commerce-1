`use strict`

const { verifyToken } = require('../helpers/jwt')
const User = require('../models/user')
const Product = require('../models/product')


function authenticating(req, res, next) {
    // console.log('masuk authen');
    try {
        req.decoded = verifyToken(req.headers.token)
        // console.log(req.decoded);
        User.findById(req.decoded.id)
            .then((user) => {
                // console.log(user);
                if (!user) throw ({ status: 404, msg: 'User undefined/not registered' })
                else next()
            })
            .catch((err) => {
                next (err)
            });
    } catch (error) {
        next(error)
    }
}

function authorizating(req, res, next) {
    Product.findById(req.params.id)
    .then((result) => {
        if(!result) throw ({status: 400, msg: 'Product not found'})
        else if(result.seller != req.decoded.id) throw({status: 403, msg: 'Forbidden!'})
        else next()
    }).catch(next);
}

function itemStock(req, res, next) {
    let list = req.body.items

    let promises = []
    list.forEach(elem => {
        promises.push(Product.findById(elem.id))
    })

    Promise.all(promises)
        .then(results => {
            let indexYangKurang = 0
            if (results.some((item, index) => {
                indexYangKurang = index
                return item.stock < list[index].qty
            })) {
                throw { message: `${list[indexYangKurang]} stock nya kurang` }
            } else {
                // bikin transaction
                next()
            }
        })
        .catch(next)
}


module.exports = {
    authenticating,
    authorizating,
    itemStock
}