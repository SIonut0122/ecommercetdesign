const express = require('express');
const path = require('path');


const PORT = 3000;
const history = require('connect-history-api-fallback');

const app = express();


if (process.env.NODE_ENV !== "production") {
    app.use(history());
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    //require webpack config
    const config = require(path.resolve(__dirname, 'webpack.config.js'));
    //create compiler
    const compiler = webpack(config);
    //use webpack-dev-middleware to serve the bundles
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
    //enable HMR
    app.use(require('webpack-hot-middleware')(compiler));
} else {
    app.use(express.static("dist"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve("./dist", "index.html"));
    });
}



//Listen
app.listen(PORT, function() {
    console.log('Server is listening...'+ PORT);
});