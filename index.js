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
let sql = require("sqlite3")

//Verif/Creation de la base de donnée SQLite
let db = new sql.Database("menu.db", (err)=>{
    if(err) throw err
    console.log("[INFO]: La base de donnée est chargée")
    db.get("SELECT isInit FROM menu", (err, result)=>{
        if(err){
            console.log("[INFO]: Initialisation de la base de donnée")
            db.serialize(()=>{
                db.run('CREATE TABLE menu (lundiMidi TEXT, lundiSoir TEXT, mardiMidi TEXT, mardiSoir TEXT, mercrediMidi TEXT, mercrediSoir TEXT, jeudiMidi TEXT, jeudiSoir TEXT, vendrediMidi TEXT, isInit BOOLEAN);', (err)=>{
                    if(err) throw err
                })
            
                db.run("INSERT INTO menu (lundiMidi, lundiSoir, mardiMidi, mardiSoir, mercrediMidi, mercrediSoir, jeudiMidi, jeudiSoir, vendrediMidi, isInit) VALUES ('Poulet', 'Frite','Poulet', 'Frite','Poulet', 'Frite','Poulet', 'Frite','Poulet', true);", (err)=>{
                    if(err) throw err
                })
            })
            console.log("[SUCCESS]: Initialisation réussie")
        }else{
            if(result.isInit){
                console.log("[INFO]: La base de donnée est déjà initialiser.")
            }
        }
    })
})



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
    console.log(getMenu())
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

function getMenu(){
    db.serialize(()=>{
        db.all("SELECT * FROM menu;", (err, result)=>{
            return result
        })
    })
}

//Démarrage du serveur

app.listen(2301, function(){
    console.log("Le serveur écoute sur le port 2301. Logs :")
});