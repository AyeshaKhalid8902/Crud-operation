import { PrismaClient } from '@prisma/client';

// Global level par check karein taake baar baar naya client na banay
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export const placeOrder = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const qty = parseInt(quantity);

        // 1. Check karein product exist karta hai aur stock hai
        const product = await prisma.product.findUnique({ 
            where: { id: productId } 
        });

        if (!product) {
            return res.status(404).json({ error: "Product nahi mila!" });
        }

        if (product.stock < qty) {
            return res.status(400).json({ error: `Sirf ${product.stock} items baqi hain!` });
        }

        // 2. Transaction: Order banayein aur Stock kam karein
        const [order, updatedProduct] = await prisma.$transaction([
            prisma.order.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: qty,
                    totalPrice: product.price * qty,
                    status: "pending"
                }
            }),
            prisma.product.update({
                where: { id: productId },
                data: { 
                    stock: { decrement: qty } 
                }
            })
        ]);

        res.status(201).json({ 
            message: "Order Successful!", 
            orderId: order.id,
            bill: order.totalPrice 
        });

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ error: "Server par koi masla hai, logs check karein." });
    }
};