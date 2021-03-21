let path = require('path')
let fs = require("fs")

let jsonFile = path.join(__dirname, "menu.json")

function modifyJson(jsonkey, value){
    let json = JSON.parse(fs.readFileSync(jsonFile).toString())
    json[jsonkey] = value
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 4))
}

function getJson(){
    let json = JSON.parse(fs.readFileSync(jsonFile).toString())
    return json
}

function delElement(jsonkey, element){
    let json = JSON.parse(fs.readFileSync(jsonFile).toString())
    json[jsonkey].pop(element)
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 4))
}


module.exports.delElement = delElement
module.exports.getJson = getJson
module.exports.modifyJson = modifyJson
