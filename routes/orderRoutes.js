import express from "express";
import Order from "../models/Order.js";
import OrderDetails from "../models/OrderDetails.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderPayment");
    const details = await OrderDetails.find({ orderId: req.params.id });

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res.json({ order, details });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

router.post("/", async (req, res) => {
  const { idCustomer, orderStatus, orderPayment, products } = req.body;

  try {
    const order = new Order({ idCustomer, orderStatus, orderPayment });
    const savedOrder = await order.save();

    const orderDetails = await Promise.all(
      products.map(async (item) => {
        const detail = new OrderDetails({
          orderId: savedOrder._id,
          ...item,
        });
        return await detail.save();
      })
    );

    res.status(201).json({ order: savedOrder, details: orderDetails });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err });
  }
});

export default router;
