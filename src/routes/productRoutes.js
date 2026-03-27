import express from 'express';
import { 
    addProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;