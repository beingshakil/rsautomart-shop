import { Request, Response } from 'express';
import Order from '../models/Order.model';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendOrderConfirmation, sendNewOrderNotification } from '../services/email.service';

const DHAKA_DISTRICTS = ['dhaka', 'gazipur', 'narayanganj', 'manikganj', 'munshiganj', 'narsingdi'];
const FREE_SHIPPING_MIN = 999;

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, couponCode, deliveryNote, items: directItems } = req.body;

    // Get items from cart or direct
    let orderItems: any[] = [];
    if (directItems && directItems.length > 0) {
      orderItems = directItems;
    } else {
      if (!req.user) {
        res.status(400).json({ message: 'No items provided.' });
        return;
      }
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        res.status(400).json({ message: 'Cart is empty.' });
        return;
      }
      orderItems = cart.items.map((item: any) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || '',
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      }));
    }

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Calculate shipping
    const district = shippingAddress.district?.toLowerCase();
    let shippingCost = DHAKA_DISTRICTS.includes(district) ? 70 : 120;

    const discount = req.body.discount || 0;
    const totalAmount = subtotal + shippingCost - discount;

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      subtotal,
      shippingCost,
      discount,
      totalAmount,
      couponCode,
      deliveryNote,
    });

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stock.quantity': -item.quantity, totalSold: item.quantity },
      });
    }

    // Clear cart
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });
    }

    // Send emails (fire and forget)
    try {
      const customerEmail = req.user?.email;
      const customerName = req.user?.name || shippingAddress?.name || 'Guest';
      if (customerEmail) {
        await sendOrderConfirmation(customerEmail, order.orderNumber, totalAmount, orderItems);
      }
      await sendNewOrderNotification(order.orderNumber, totalAmount, customerName);
    } catch {}

    res.status(201).json({ order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }

    // Customers can only see their own orders
    if (req.user.role !== 'admin' && order.user._id?.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const filter: any = {};
    if (status) filter.orderStatus = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderStatus, paymentStatus, trackingId } = req.body;
    const update: any = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (trackingId) update.trackingId = trackingId;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }
    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
