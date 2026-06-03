import crypto from "node:crypto";
import { config } from "../config.js";
import { promoCodes as sourcePromoCodes } from "../promoCodes.js";
import { id } from "../utils/crypto.js";
import { apiError } from "../utils/http.js";

const plans = {
  starter: {
    id: "starter",
    name: "AKRIVO Skin Starter",
    amount: 0,
    originalAmount: 0,
    currency: "INR",
    description: "Free routine guidance, reminders, progress notes, and safe product-category planning.",
    features: ["AI skin wellness chat", "Routine and reminders", "Private progress notes"]
  },
  pro: {
    id: "pro",
    name: "AKRIVO Skin Pro",
    amount: 2900,
    originalAmount: 9900,
    currency: "INR",
    description: "More complete guidance for users who want deeper routine and progress support.",
    features: ["Everything in Starter", "Advanced progress context", "More detailed product planning"]
  },
  duo: {
    id: "duo",
    name: "AKRIVO Skin Duo",
    amount: 3900,
    originalAmount: 9900,
    currency: "INR",
    description: "Partner routine support with privacy controls and Duo-code access.",
    features: ["Everything in Pro", "Generate a Duo code", "Partner routine status controls"]
  }
};

export function listPlans() {
  return Object.values(plans);
}

export function listPromoCodes() {
  return Object.fromEntries(["pro", "duo"].map(planId => [planId, normalizePromo(sourcePromoCodes[planId])]));
}

export function updatePromoCodes() {
  throw apiError("Promo codes are managed in server/promoCodes.js.", 400);
}

export async function createRazorpayOrder(db, userId, planId = "starter", promoCode = "") {
  const plan = plans[planId];
  if (!plan) throw apiError("Plan not found.", 404);
  const pricing = applyPromo(db, plan, promoCode);
  const receipt = `akrivo_${Date.now()}_${userId.slice(0, 8)}`;
  const localPayment = {
    id: id("pay_"),
    userId,
    provider: "razorpay",
    mode: config.razorpayTestMode ? "test" : "live",
    planId: plan.id,
    amount: pricing.amount,
    originalAmount: plan.amount,
    discountAmount: pricing.discountAmount,
    discountPercent: pricing.discountPercent,
    promoCode: pricing.promoCode,
    currency: plan.currency,
    status: "created",
    receipt,
    providerOrderId: null,
    providerPaymentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (pricing.amount <= 0) {
    localPayment.status = "free_activated";
    localPayment.provider = "free";
    localPayment.providerOrderId = `free_${localPayment.id}`;
    localPayment.providerPaymentId = "free_plan";
    localPayment.providerResponse = { id: localPayment.providerOrderId, status: "activated", free: true };
    db.payments[localPayment.id] = localPayment;
    activateUserPlan(db, userId, localPayment);
    return {
      payment: localPayment,
      checkout: {
        amount: 0,
        currency: plan.currency,
        name: "AKRIVO Skin",
        description: plan.description,
        order_id: localPayment.providerOrderId,
        localPaymentId: localPayment.id,
        free: true,
        mock: true
      }
    };
  }

  if (config.razorpayKeyId && config.razorpayKeySecret) {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString("base64")}`
      },
      body: JSON.stringify({
        amount: pricing.amount,
        currency: plan.currency,
        receipt,
        notes: {
          localPaymentId: localPayment.id,
          userId,
          planId: plan.id,
          promoCode: pricing.promoCode
        }
      })
    });
    if (!response.ok) throw apiError("Could not create Razorpay order.", 502);
    const order = await response.json();
    localPayment.providerOrderId = order.id;
    localPayment.providerResponse = { id: order.id, status: order.status };
  } else {
    localPayment.providerOrderId = `order_test_${localPayment.id}`;
    localPayment.providerResponse = { id: localPayment.providerOrderId, status: "created", mock: true };
  }

  db.payments[localPayment.id] = localPayment;
  return {
    payment: localPayment,
    checkout: {
      key: config.razorpayKeyId || "rzp_test_mock_only",
      amount: pricing.amount,
      currency: plan.currency,
      name: "AKRIVO Skin",
      description: plan.description,
      order_id: localPayment.providerOrderId,
      localPaymentId: localPayment.id,
      testMode: localPayment.mode === "test",
      mock: !config.razorpayKeyId || !config.razorpayKeySecret
    }
  };
}

export function verifyRazorpayPayment(db, userId, input) {
  const payment = db.payments[input.localPaymentId];
  if (!payment || payment.userId !== userId) throw apiError("Payment record not found.", 404);
  if (payment.providerOrderId !== input.razorpay_order_id) throw apiError("Payment order mismatch.", 400);

  if (payment.providerResponse?.mock) {
    payment.status = "test_verified";
  } else {
    const expected = crypto
      .createHmac("sha256", config.razorpayKeySecret)
      .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== input.razorpay_signature) throw apiError("Payment signature verification failed.", 400);
    payment.status = "paid";
  }

  payment.providerPaymentId = input.razorpay_payment_id || "mock_payment";
  payment.updatedAt = new Date().toISOString();
  db.payments[payment.id] = payment;
  if (["paid", "test_verified"].includes(payment.status)) activateUserPlan(db, userId, payment);
  return payment;
}

export function planName(planId) {
  return plans[planId]?.name || "Free";
}

function applyPromo(db, plan, rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (plan.amount <= 0) return { amount: 0, discountAmount: 0, discountPercent: 0, promoCode: "" };
  if (!code) return { amount: plan.amount, discountAmount: 0, discountPercent: 0, promoCode: "" };
  const promo = normalizePromo(sourcePromoCodes[plan.id]);
  if (!promo.code || promo.code !== code || promo.percentOff <= 0) {
    throw apiError("Promo code is not active for this plan.", 400);
  }
  const discountAmount = Math.floor(plan.amount * (promo.percentOff / 100));
  return {
    amount: Math.max(100, plan.amount - discountAmount),
    discountAmount,
    discountPercent: promo.percentOff,
    promoCode: promo.code
  };
}

function activateUserPlan(db, userId, payment) {
  const user = db.users[userId];
  if (!user) return;
  user.planId = payment.planId;
  user.planActivatedAt = payment.updatedAt;
  user.updatedAt = payment.updatedAt;
  db.users[user.id] = user;
}

function normalizePromo(promo = {}) {
  const code = String(promo.code || "").trim().toUpperCase();
  return {
    planId: promo.planId || "",
    code,
    percentOff: code ? Math.max(0, Math.min(100, Number(promo.percentOff || 0))) : 0,
    updatedAt: promo.updatedAt || null
  };
}
