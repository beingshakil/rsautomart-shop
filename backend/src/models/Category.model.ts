import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: { url: string; publicId: string };
  description?: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: {
      url: String,
      publicId: String,
    },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
