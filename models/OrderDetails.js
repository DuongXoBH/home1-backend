import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    productAttributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductAttribute",
    },
    quantity: { type: Number, required: true },
    productPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderDetails = mongoose.model("OrderDetails", orderDetailsSchema);
export default OrderDetails;
