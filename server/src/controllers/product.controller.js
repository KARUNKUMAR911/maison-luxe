const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const productService = require("../services/product.service");

exports.getProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query);
  ApiResponse.paginated(res, products, pagination);
});

exports.getFeatured = asyncHandler(async (req, res) => {
  const products = await productService.getFeatured(req.query.limit);
  ApiResponse.ok(res, products);
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  ApiResponse.ok(res, product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  ApiResponse.created(res, product, "Product created");
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  ApiResponse.ok(res, product, "Product updated");
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  ApiResponse.ok(res, null, "Product deleted");
});
