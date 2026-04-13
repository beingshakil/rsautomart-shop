import { Request, Response } from 'express';
import slugify from 'slugify';
import Category from '../models/Category.model';
import cloudinary from '../config/cloudinary';
import sharp from 'sharp';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).populate('parent', 'name slug');
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parent, metaTitle, metaDescription } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    let image;
    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'rs-automart/categories' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        sharp(req.file!.buffer)
          .resize(500, 500, { fit: 'cover', background: { r: 255, g: 255, b: 255, alpha: 1 } })
          .webp({ quality: 80 })
          .toBuffer()
          .then(optimizedBuffer => stream.end(optimizedBuffer))
          .catch(reject);
      });
      image = { url: result.secure_url, publicId: result.public_id };
    }

    const category = await Category.create({ name, slug, description, parent, image, metaTitle, metaDescription });
    res.status(201).json({ category });
  } catch (error: any) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parent, isActive, removeImage, metaTitle, metaDescription } = req.body;
    const updateData: any = { description, parent: parent || null, isActive, metaTitle, metaDescription };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const existing = await Category.findById(req.params.id);

    if (req.file) {
      if (existing?.image?.publicId) {
        await cloudinary.uploader.destroy(existing.image.publicId);
      }
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'rs-automart/categories' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        sharp(req.file!.buffer)
          .resize(500, 500, { fit: 'cover', background: { r: 255, g: 255, b: 255, alpha: 1 } })
          .webp({ quality: 80 })
          .toBuffer()
          .then(optimizedBuffer => stream.end(optimizedBuffer))
          .catch(reject);
      });
      updateData.image = { url: result.secure_url, publicId: result.public_id };
    } else if (removeImage === 'true') {
      if (existing?.image?.publicId) {
        await cloudinary.uploader.destroy(existing.image.publicId);
      }
      updateData.image = null;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().populate('parent', 'name slug');
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

