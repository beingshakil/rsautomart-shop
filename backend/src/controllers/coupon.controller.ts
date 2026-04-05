import { Request, Response } from 'express';
import Coupon from '../models/Coupon.model';

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(404).json({ message: 'Invalid coupon code.' });
      return;
    }

    if (coupon.expiresAt < new Date()) {
      res.status(400).json({ message: 'Coupon has expired.' });
      return;
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ message: 'Coupon usage limit reached.' });
      return;
    }

    if (orderAmount < coupon.minOrderAmount) {
      res.status(400).json({ message: `Minimum order amount is ৳${coupon.minOrderAmount}.` });
      return;
    }

    const discount =
      coupon.discountType === 'percent'
        ? Math.round((orderAmount * coupon.discountValue) / 100)
        : coupon.discountValue;

    res.json({ coupon, discount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found.' });
      return;
    }
    res.json({ coupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
