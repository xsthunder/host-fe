var fallback = require('express-history-api-fallback')
var express = require('express')
var proxy = require('http-proxy-middleware');
var fs = require('fs')
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
var root = './dist'

let port = process.argv[2]
port = port?port:'8080'

if(port.match(/\d+/).length>0){
    port = port.match(/\d+/)[0]
    port = parseInt(port)
}
else {
    port = 8080
}

// webdev proxy like see https://webpack.js.org/configuration/dev-server/#devserverproxy
// or https://webpack.js.org/configuration/dev-server/#devserverproxy
var configFileContent = fs.readFileSync('./proxy.conf.json')

const config = JSON.parse(configFileContent)

Object.entries(config).map(([url, urlconfig])=>{
    app.use(
      url,
      proxy(urlconfig)
    );
})

app.use(express.static(root))
app.use(fallback('index.html', { root: root  }))

app.listen(8080)
console.log(`app listen on ${port} hosting ${root}`)
console.log(`webproxy config ${configFileContent}`)
console.log(`avaliable adress`)
logIp()
