import mongoose from "mongoose";

const orderPaymentSchema = new mongoose.Schema(
  {
    payment_method: { type: String, required: true }, // e.g. "credit_card", "paypal", "cod"
    transaction_id: { type: String },
    total_amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total_paid: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderPayment = mongoose.model("OrderPayment", orderPaymentSchema);
export default OrderPayment;
