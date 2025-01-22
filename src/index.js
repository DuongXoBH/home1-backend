import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';

// Cấu hình CORS và Body Parser
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb+srv://xonghean:2W2rJMNhqG2827e3@cluster0.tzfh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Đăng ký các route
app.use('', userRoutes);

// Lắng nghe trên cổng 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
