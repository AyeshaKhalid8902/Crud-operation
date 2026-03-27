import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); 
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Inventory API is running successfully!" });
});

// Port Handling for Local and Vercel
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Vercel ke liye export karna zaroori hai
export default app;