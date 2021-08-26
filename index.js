const express = require('express');
require('express-async-error')
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary')
const cors = require('cors')
//router

const user = require('./router/user')
const auth = require('./router/login')
const submit = require('./router/submit')
const compile = require('./router/compile')
const problem = require('./router/problem')
const friend = require('./router/friend')
const fight = require('./router/fight')

const logger = require('./config/logger')

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
const url = process.env.MONGO_URL;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, () => {
    console.log('connected')
})
mongoose.connection.on("error", (err) => {
    console.error(err);
})
mongoose.set('useCreateIndex', true);

app.use(fileupload({
    useTempFiles : true
}))
app.use(cors())
app.use('/user', user)
app.use('/login',auth)
app.use('/submit', submit)
app.use('/compile', compile)
app.use('/problem' , problem )
app.use('/fight' , fight )
app.use('/friend' , friend )

app.all('*',(req,res,next) => {
    res.status(404).json({
        msg : 'Page not found',
        status : 'false'
    })
})
let port = process.env.PORT || 3000
app.listen(port, () => console.error('connected on port 3000'));