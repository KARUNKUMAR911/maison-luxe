const Joi = require("joi");

const addressSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName:  Joi.string().required(),
  line1:     Joi.string().required(),
  line2:     Joi.string().allow("", null),
  city:      Joi.string().required(),
  state:     Joi.string().required(),
  zip:       Joi.string().required(),
  country:   Joi.string().length(2).required(),
});

const placeOrder = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required(),
      quantity:  Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  shippingAddress: addressSchema.required(),
  paymentMethod:   Joi.string().valid("stripe", "cod").default("stripe"),
  notes:           Joi.string().max(500).allow("", null),
});

const updateStatus = Joi.object({
  status:         Joi.string().valid("PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED").required(),
  trackingNumber: Joi.string().allow("", null),
});

module.exports = { placeOrder, updateStatus };
