const express = require(`express`);
const mongoose = require(`mongoose`);
const morgan = require(`morgan`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const cors = require(`cors`);
const expressValidator = require(`express-validator`);
require('dotenv').config();

// import routes
const authRoutes = require(`./routes/auth`);
const userRoutes = require(`./routes/user`);
const categoryRoutes = require(`./routes/category`);
const productRoutes = require(`./routes/product`);
const braintreeRoutes = require(`./routes/braintree`);
const orderRoutes = require(`./routes/order`);
// const stripeRoutes = require(`./routes/stripe`);
// app
const app = express();


// database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    }).then(() => {
    console.log("DB connected");
});

mongoose.set('useFindAndModify', false);

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors()); // allows backend and frontend to communicate from different ports

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);
// app.use("/api", stripeRoutes);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
