import express from "express";
import OrderPayment from "../models/OrderPayment.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    paymentMethod,
    transactionId,
    totalAmount,
    discount,
    tax,
    totalPaid,
  } = req.body;

  try {
    const payment = new OrderPayment({
      paymentMethod,
      transactionId,
      totalAmount,
      discount,
      tax,
      totalPaid,
    });

    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo thanh toán", error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments = await OrderPayment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy payment", error: err });
  }
});

export default router;
