//Dependances
let express = require('express')
let app = express();
let bodyParser = require("body-parser")
let cookieParser = require('cookie-parser')
let favicon = require('serve-favicon')
let bcrypt = require('bcrypt')
let jwt = require("jsonwebtoken")
let path = require('path')
let fs = require('fs')

//Variables globales
const JWT_TOKEN = "71XhnFBWleoYYxbjGYJxItcv2odyr0g4"

//Middlewares
app.use(favicon(path.join(__dirname, 'static/imgs', 'favicon.png')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

//Routes non-protéges
app.get('/', (req, res)=>{
    res.render('index')
})

//Routes protéges


//Fonctions utiles
function verifyToken(token){
    return new Promise((resolve, reject) =>{
        jwt.verify(token, JWT_TOKEN, function(err, decoded){
            if(err){
                reject()
            }else{
                resolve(decoded)
            }
        })
    })
}

//Démarrage du serveur

app.listen(2301, function(){
    console.log("Le serveur écoute sur le port 2301. Logs :")
});