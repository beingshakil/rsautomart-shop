import { Request, Response } from 'express';
import FlashSale from '../models/FlashSale.model';

export const getFlashSale = async (_req: Request, res: Response): Promise<void> => {
  try {
    const flashSale = await FlashSale.findOne({ isActive: true })
      .populate({
        path: 'products',
        match: { isActive: true },
        select: 'name price discountPrice images slug stock status'
      });
    
    if (!flashSale || flashSale.endDate < new Date()) {
      res.json({ flashSale: null });
      return;
    }

    res.json({ flashSale });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFlashSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { products, endDate, isActive } = req.body;

    let flashSale = await FlashSale.findOne();

    if (flashSale) {
      flashSale.products = products;
      flashSale.endDate = new Date(endDate);
      flashSale.isActive = isActive;
      await flashSale.save();
    } else {
      flashSale = await FlashSale.create({
        products,
        endDate: new Date(endDate),
        isActive
      });
    }

    res.json({ message: 'Flash Sale updated', flashSale });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
