import { Request, Response } from 'express';
import Review from '../models/Review.model';
import Product from '../models/Product.model';
import Order from '../models/Order.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user has purchased and received this product
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'delivered',
    });

    const isVerifiedPurchase = !!order;

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      isVerifiedPurchase,
    });

    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      ratings: { average: Math.round(avgRating * 10) / 10, count: reviews.length },
    });

    await review.populate('user', 'name');
    res.status(201).json({ review });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'You have already reviewed this product.' });
      return;
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ message: 'Review not found.' });
      return;
    }

    // Only admin or review owner can delete
    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate ratings
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Product.findByIdAndUpdate(productId, {
      ratings: { average: Math.round(avgRating * 10) / 10, count: reviews.length },
    });

    res.json({ message: 'Review deleted.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
