const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'titulo obrigatorio'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'slug obrigatorio'],
        unique: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'descricao obrigatoria']
    },
    price: {
        type: Number,
        required: [true, 'preco obrigatorio']
    },
    active: {
        type: Boolean,
        required: true,
        default:true
    },
    tags: [{
        type: String,
        required: [true, 'tags sao obrigatorias']
    }],
    image: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Product', schema)


