import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	thumbnail: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		unique: true,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
});

const productModel = mongoose.model('products', productSchema);

export default productModel;