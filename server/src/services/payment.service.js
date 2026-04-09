const Stripe = require("stripe");
const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

const createPaymentIntent = async (userId, { orderId }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw ApiError.notFound("Order not found");
  if (order.userId !== userId) throw ApiError.forbidden("Access denied");
  if (order.paymentStatus === "PAID") throw ApiError.badRequest("Order already paid");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100), // cents
    currency: "usd",
    metadata: { orderId: order.id, orderNumber: order.orderNumber, userId },
    automatic_payment_methods: { enabled: true },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentId: paymentIntent.id },
  });

  return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
};

const handleWebhook = async (rawBody, signature) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw ApiError.badRequest(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const { orderId } = event.data.object.metadata;
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const { orderId } = event.data.object.metadata;
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "FAILED" },
      });
      break;
    }
    case "charge.refunded": {
      const paymentIntentId = event.data.object.payment_intent;
      await prisma.order.updateMany({
        where: { paymentId: paymentIntentId },
        data: { paymentStatus: "REFUNDED", status: "REFUNDED" },
      });
      break;
    }
  }

  return { received: true };
};

module.exports = { createPaymentIntent, handleWebhook };
