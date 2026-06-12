import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import {
  SubmitContactLeadBody,
  SubmitSellerLeadBody,
  SubmitBuyerPlanLeadBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { fullName, phone, email, message } = parsed.data;

  await db.insert(leadsTable).values({
    type: "contact",
    status: "new",
    fullName,
    phone,
    email,
    data: { message: message ?? "" },
  });

  res.status(201).json({ success: true, message: "Thank you for reaching out. We will contact you soon." });
});

router.post("/leads/seller", async (req, res): Promise<void> => {
  const parsed = SubmitSellerLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { fullName, phone, email, propertyAddress, timeline, message } = parsed.data;

  await db.insert(leadsTable).values({
    type: "seller",
    status: "new",
    fullName,
    phone,
    email,
    data: { propertyAddress, timeline: timeline ?? "", message: message ?? "" },
  });

  res.status(201).json({ success: true, message: "Thank you. We will be in touch to discuss your home value." });
});

router.post("/leads/buyer-plan", async (req, res): Promise<void> => {
  const parsed = SubmitBuyerPlanLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { fullName, phone, email, purpose, priceRange, downPaymentRange, creditScoreRange, timeline, comments } = parsed.data;

  await db.insert(leadsTable).values({
    type: "buyer_plan",
    status: "new",
    fullName,
    phone,
    email,
    data: {
      purpose,
      priceRange: priceRange ?? "",
      downPaymentRange: downPaymentRange ?? "",
      creditScoreRange: creditScoreRange ?? "",
      timeline: timeline ?? "",
      comments: comments ?? "",
    },
  });

  res.status(201).json({ success: true, message: "Thank you. Your information has been received. A professional will contact you soon." });
});

export default router;
