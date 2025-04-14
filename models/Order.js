import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    idCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderStatus: { type: String, required: true, default: "pending" },
    orderPayment: { type: mongoose.Schema.Types.ObjectId, ref: "OrderPayment" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
