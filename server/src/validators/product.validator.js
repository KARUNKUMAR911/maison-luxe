const Joi = require("joi");

const create = Joi.object({
  name:         Joi.string().min(2).max(200).required(),
  slug:         Joi.string().min(2).max(200).required(),
  description:  Joi.string().min(10).required(),
  price:        Joi.number().positive().required(),
  comparePrice: Joi.number().positive().allow(null),
  stock:        Joi.number().integer().min(0).required(),
  sku:          Joi.string().required(),
  categoryId:   Joi.string().uuid().required(),
  images:       Joi.array().items(Joi.string().uri()).min(1).required(),
  tags:         Joi.array().items(Joi.string()),
  isFeatured:   Joi.boolean(),
  isActive:     Joi.boolean(),
  weight:       Joi.number().positive().allow(null),
  dimensions:   Joi.object().allow(null),
});

const update = create.fork(
  ["name","slug","description","price","stock","sku","categoryId","images"],
  (schema) => schema.optional()
);

module.exports = { create, update };
