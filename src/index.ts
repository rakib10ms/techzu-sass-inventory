import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { prisma } from './lib/prisma';
import companyRoutes from './routes/company.routes';
import outletRoutes from './routes/outlet.routes';
import userRoutes from './routes/user.routes';
import customerRouter from './routes/customer.routes';
import productRouter from './routes/product.routes';
import outletProductRouter from './routes/outletProduct.routes';
import reportRoutes from './routes/report.routes';

import roleRouter from './routes/role.routes';
import saleRouter from './routes/sale.routes';
import { globalErrorHandler } from './middlewares/globalErrorhandler';
const app = express();
const PORT = process.env.APPLICATION_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

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
app.use('/api/reports', reportRoutes);
app.use('/api/roles', roleRouter);
app.use(globalErrorHandler);
