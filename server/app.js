const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/UserRoutes');
const projectRouter = require('./routes/ProjectRoutes');
const OAuthRouter = require('./routes/OAuthRoutes');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicPath, {
    extensions: ['html']
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type, Accept , x-auth');

    next();
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/oauth', OAuthRouter);
module.exports = app;