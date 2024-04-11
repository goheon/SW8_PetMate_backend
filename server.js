import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/users.js';
import { booklistRouter } from './routes/booklist.js';
import { orderSitterRouter } from './routes/ordersitter.js';
import { sitterMyPageRouter } from './routes/sittermypage.js';
import bodyParser from 'body-parser';
import mongoose from "mongoose";

import errorMiddleware from './middlewares/errorMiddleware.js';


dotenv.config();

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';
const db_id = process.env.DB_ID;
const db_pw = process.env.DB_PW;


// Create http server
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

//mongoose, mongodb 연결
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@petmate.bhm01el.mongodb.net/?retryWrites=true&w=majority&appName=PetMate`,
    );
    console.log("MongoDB 연결 성공");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

//미들웨어
app.use(errorMiddleware);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//페이지 api

app.use('/', authRouter);
app.use('/mypage', userRouter);
app.use('/booklist', booklistRouter);
app.use('/orderSitter', orderSitterRouter);
app.use('/sitterpage', sitterMyPageRouter);



// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});




