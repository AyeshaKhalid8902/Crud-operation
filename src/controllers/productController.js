import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Add New Product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const newProduct = await prisma.product.create({
            data: { 
                name, 
                description, 
                price: parseFloat(price), 
                stock: parseInt(stock) 
            }
        });
        res.status(201).json({ message: "Product Added!", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Product (With Safety Checks)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, stock, name, description } = req.body;

        // Pehle check karein ke product exist karta hai ya nahi
        const productExists = await prisma.product.findUnique({ where: { id } });

        if (!productExists) {
            return res.status(404).json({ error: "Product not found with this ID" });
        }

        const updated = await prisma.product.update({
            where: { id: id },
            data: { 
                price: price !== undefined ? parseFloat(price) : undefined, 
                stock: stock !== undefined ? parseInt(stock) : undefined,
                name: name || undefined,
                description: description || undefined
            }
        });
        res.status(200).json({ message: "Product Updated!", updated });
    } catch (error) {
        console.error("Update Error:", error); // Terminal mein error dekhne ke liye
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const productExists = await prisma.product.findUnique({ where: { id } });
        if (!productExists) {
            return res.status(404).json({ error: "Product not found" });
        }

        await prisma.product.delete({ where: { id: id } });
        res.status(200).json({ message: "Product Deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};