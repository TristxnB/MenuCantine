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
let JsonUtil = require("./json-utils")

let adminDb = require("./admin.json")

//Variables globales
const JWT_TOKEN = "71XhnFBWleoYYxbjGYJxItcv2odyr0g4"
const fileMenu = path.join(__dirname, "menu.json")
const baseMenu =
{
    "lundiMidi": [],
    "lundiSoir": [],
    "mardiMidi": [],
    "mardiSoir": [],
    "mercrediMidi": [],
    "mercrediSoir": [],
    "jeudiMidi": [],
    "jeudiSoir": [],
    "vendrediMidi": []

}

//Verif/Creation de la base de donnée
if(!fs.existsSync(fileMenu)){
    console.log("[INFO]: Base de donnée en cours de création...")
    fs.writeFileSync(fileMenu, JSON.stringify(baseMenu, null, 4))
    console.log("[INFO]: Base de donnée créer !")
}

//Middlewares
app.use(favicon(path.join(__dirname, 'static/imgs', 'favicon.png')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

//Routes non-protéges
app.get('/', (req, res)=>{
    res.render('index', {
        menu: JsonUtil.getJson()
    })
})

app.get('/login', (req, res)=>{
    verifyToken(req.cookies.token).then((decrypt)=>{
        res.redirect("/admin")
    }).catch(()=>{
        res.render("login", {
            err: null
        })
    })
})

app.post('/login', (req, res)=>{
    let user = req.body.user
    let pass = req.body.pass
    if(user != adminDb.user && pass != adminDb.pass){
        res.render('login', {
            err: "Identifiants incorrects"
        })
    }else{
        res.cookie("token", jwt.sign({user: user}, JWT_TOKEN))
        res.redirect("/admin")
    }
})


//Routes protéges
app.get('/admin', (req, res)=>{
    verifyToken(req.cookies.token).then((decrypt)=>{
        res.render("admin", {
            userInfo: decrypt
        })
    }).catch(()=>{
        res.redirect("/login")
    })
})


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