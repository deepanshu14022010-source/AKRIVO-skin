import express from "express";
import { requireAdmin } from "../middleware/admin.js";
import { audit } from "../services/auditService.js";
import { listPromoCodes, updatePromoCodes } from "../services/paymentService.js";
import { asyncHandler } from "../utils/http.js";
import { promoCodeSettingsSchema, validate } from "../utils/validation.js";

export const adminRouter = express.Router();

adminRouter.get("/admin/users", requireAdmin, asyncHandler(async (req, res) => {
  audit(req.db, req.user.id, "admin_list_users");
  const users = Object.values(req.db.users).map(user => ({
    id: `${user.id.slice(0, 7)}...`,
    email: maskEmail(user.email),
    createdAt: user.createdAt,
    consentAccepted: Boolean(user.consentAccepted),
    processingRestricted: Boolean(user.processingRestricted)
  }));
  res.json({ users });
}));

adminRouter.get("/admin/audit-logs", requireAdmin, asyncHandler(async (req, res) => {
  audit(req.db, req.user.id, "admin_view_audit_logs");
  res.json({ auditLogs: Object.values(req.db.auditLogs).slice(-200) });
}));

adminRouter.get("/admin/breach-events", requireAdmin, asyncHandler(async (req, res) => {
  audit(req.db, req.user.id, "admin_view_breach_events");
  res.json({ breachEvents: Object.values(req.db.breachEvents).slice(-100) });
}));

adminRouter.get("/admin/promo-codes", requireAdmin, asyncHandler(async (req, res) => {
  audit(req.db, req.user.id, "admin_view_promo_codes");
  res.json({ promoCodes: listPromoCodes(req.db) });
}));

adminRouter.patch("/admin/promo-codes", requireAdmin, asyncHandler(async (req, res) => {
  const input = validate(promoCodeSettingsSchema, req.body);
  const promoCodes = updatePromoCodes(req.db, input);
  audit(req.db, req.user.id, "admin_update_promo_codes");
  res.json({ promoCodes });
}));

function maskEmail(email) {
  const [name, domain] = String(email || "").split("@");
  return domain ? `${name.slice(0, 2)}***@${domain}` : "[redacted]";
}
