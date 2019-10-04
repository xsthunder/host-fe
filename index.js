var fallback = require('express-history-api-fallback')
var express = require('express')
var proxy = require('http-proxy-middleware');
var fs = require('fs')

var app = express()
var root = './dist'

const port = 8080

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
