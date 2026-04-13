import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashSale extends Document {
  products: mongoose.Types.ObjectId[];
  endDate: Date;
  isActive: boolean;
}

const flashSaleSchema = new Schema<IFlashSale>(
  {
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFlashSale>('FlashSale', flashSaleSchema);
