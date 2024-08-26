const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDetail: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    quality: {
        type: String,
        required: true,
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]

})

// productSchema.pre(/^find/, function (next) {
//     this.populate({
//         // strictPopulate: false,
//         path: 'user',
//         select: 'name'
//     });

//     next()
// })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
module.exports = Product