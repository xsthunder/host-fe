

/** 
 * choose from webpack or config.json
 */

// from conifg.json
var fs = require('fs')
var configFileContent = fs.readFileSync('./proxy.conf.json')
const config = JSON.parse(configFileContent)

// from webpack
// var webpackConfig = require('./webpack').devServer.proxy
// const config = webpackConfig


/**
 * choose dir to host, use relative or absolute path
 */

var root = './dist'
root = "../dialogue-web-front-end/dist/"

/**
 * choose port
 */
const port = 8888

var fallback = require('express-history-api-fallback')
var express = require('express')
var proxy = require('http-proxy-middleware');
var os = require('os')

var ifaces = os.networkInterfaces();

// see https://github.com/dkarmalita/http-serve/blob/db53777827f1fa473d3137195c41282d5334cf92/bin/http-serve#L144
function logIp(){
    Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
                console.log('http://' + details.address + ':' + port.toString());
            }
        });
    });
}

var app = express()


// webdev proxy like see https://webpack.js.org/configuration/dev-server/#devserverproxy
// or https://webpack.js.org/configuration/dev-server/#devserverproxy


Object.entries(config).map(([url, urlconfig])=>{
    app.use(
      url,
      proxy(urlconfig)
    );
})

app.use(express.static(root))
app.use(fallback('index.html', { root: root  }))

app.listen(port)
console.log(`app listen on ${port} hosting ${root}`)
console.log(`webproxy config ${configFileContent}`)
console.log(`avaliable adress`)
logIp()
