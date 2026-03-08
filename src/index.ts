import express from 'express';
import 'dotenv/config';
import { prisma } from './lib/prisma';
import companyRoutes from './routes/company.routes';
import outletRoutes from './routes/outlet.routes';
import userRoutes from './routes/user.routes';
import customerRouter from './routes/customer.routes';
import productRouter from './routes/product.routes';
import outletProductRouter from './routes/outletProduct.routes';
import saleRouter from './routes/sale.routes';
import { globalErrorHandler } from './middlewares/globalErrorhandler';
const app = express();
const PORT = process.env.APPLICATION_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ এটাও

if (prisma) {
  console.log('🛠️ Prisma instance initialized...');
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
app.use('/api/products', productRouter);
app.use('/api/outlet-products', outletProductRouter);
app.use('/api/sales', saleRouter);
app.use('/api/companies', companyRoutes);
app.use('/api/outlets', outletRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRouter);
app.use(globalErrorHandler);
