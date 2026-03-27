import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const placeOrder = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // 1. Check karein product ka stock kitna hai
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.stock < quantity) {
            return res.status(400).json({ error: "Stock khatam hai ya product nahi mila!" });
        }

        // 2. Transaction: Order banayein aur Stock kam karein
        const order = await prisma.$transaction([
            prisma.order.create({
                data: {
                    userId,
                    productId,
                    quantity: parseInt(quantity),
                    totalPrice: product.price * quantity
                }
            }),
            prisma.product.update({
                where: { id: productId },
                data: { stock: { decrement: parseInt(quantity) } }
            })
        ]);

        res.status(201).json({ message: "Order Successful!", order: order[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};