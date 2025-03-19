import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'

let LSDiceList = []
if (localStorage.getItem("dice")) {
    LSDiceList = JSON.parse(localStorage.getItem("dice"))
}
console.log(LSDiceList)
console.log(LSDiceList[0])
// localStorage.setItem("dice", "")

const vertices10 = [
    [0, 0, 0.5],
    [0, 0, -0.5],
  ].flat();

  for (let i = 0; i < 10; ++i) {
    const b = (i * Math.PI * 2) / 10;
    vertices10.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
  }

  const faces10 = [
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
    [0, 5, 6],
    [0, 6, 7],
    [0, 7, 8],
    [0, 8, 9],
    [0, 9, 10],
    [0, 10, 11],
    [0, 11, 2],
    [1, 3, 2],
    [1, 4, 3],
    [1, 5, 4],
    [1, 6, 5],
    [1, 7, 6],
    [1, 8, 7],
    [1, 9, 8],
    [1, 10, 9],
    [1, 11, 10],
    [1, 2, 11],
  ].flat();
  
  function makeDiceMaterialCanvas(backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness) {
  let diceTextureNums = [];
  for (let i = 1; i <= 20; i++) {
    let c = document.createElement("canvas");
    c.width = 60;
    c.height = 60;
    let ctx = c.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    ctx.font = "bold 34px " + font;
    let text = i;
    if (i == 6 || i == 9) {
        ctx.beginPath();
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 3;
        ctx.moveTo(20,45);
        ctx.lineTo(40,45);
        ctx.stroke();
    }
    ctx.fillText(text, c.width * 0.5, c.height * 0.5);
    let tex = new THREE.CanvasTexture(c);
    const testMaterial = new THREE.MeshPhysicalMaterial()
    testMaterial.map = tex
    testMaterial.roughness = roughness;
    testMaterial.metalness = metalness;
    testMaterial.clearcoat = clearcoat;
    testMaterial.clearcoatRoughness = clearcoatRoughness;
    diceTextureNums.push(testMaterial)
  }
  for (let i = 0; i < 10; i++) {
    let c = document.createElement("canvas");
    c.width = 60;
    c.height = 60;
    let ctx = c.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    ctx.font = "bold 34px " + font;
    let text = i + "0";
    ctx.fillText(text, c.width * 0.5, c.height * 0.5);
    let tex = new THREE.CanvasTexture(c);
    const testMaterial = new THREE.MeshPhysicalMaterial()
    testMaterial.map = tex
    testMaterial.roughness = roughness;
    testMaterial.metalness = metalness;
    testMaterial.clearcoat = clearcoat;
    testMaterial.clearcoatRoughness = clearcoatRoughness;
    diceTextureNums.push(testMaterial)
  }
  return diceTextureNums;
  }
  function makeDiceMaterialCanvas4(backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness) {
    let dice4Materials = []
    const listOfNums = [[1,2,3], [3,4,1], [1,4,2], [2,4,3]]
    for (let i = 0; i < 4; i++) {
let c = document.createElement("canvas");
    c.width = 60;
    c.height = 60;
    let ctx = c.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.translate(30,42)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    ctx.font = "bold 15px " + font;
    let text = listOfNums[i][0];
    ctx.fillText(text, 0, -25);
    ctx.rotate(Math.PI*(120/180))
    text = listOfNums[i][1];
    ctx.fillText(text, 0, -20);
    ctx.rotate(Math.PI*(120/180))
    text = listOfNums[i][2];
    ctx.fillText(text, 0, -20);
    let tex = new THREE.CanvasTexture(c);
    const testMat4 = new THREE.MeshPhysicalMaterial()
    testMat4.map = tex  
    testMat4.roughness = roughness;
    testMat4.metalness = metalness;
    testMat4.clearcoat = clearcoat;
    testMat4.clearcoatRoughness = clearcoatRoughness;
    dice4Materials.push(testMat4)
    }
    return dice4Materials
}
  
  
  let geometry4 = new THREE.TetrahedronGeometry(0.5, 0);
  geometry4.faceVertexUvs[0][0] = [new THREE.Vector2(0,1.5), new THREE.Vector2(0,0), new THREE.Vector2(1.5,1.5)]
  for (let i = 0; i < 4; i++) {
      geometry4.faces[i].materialIndex = i;
      geometry4.faceVertexUvs[0][i] = [new THREE.Vector2(1,0), new THREE.Vector2(0.5,1), new THREE.Vector2(0,0)]
  }
  
 let geometry8 = new THREE.OctahedronGeometry(0.5)
 for (let i = 0; i < 8; i++) {
      geometry8.faces[i].materialIndex = i;
      geometry8.faceVertexUvs[0][i] = [new THREE.Vector2(1.5,0), new THREE.Vector2(0.5,1.5), new THREE.Vector2(-0.5,0)]
 }
 let geometry12 = new THREE.DodecahedronGeometry(0.5)
 geometry12.computeFaceNormals()
 for (let i = 0; i < 12; i++) {
    geometry12.faces[i*3].materialIndex = i
    geometry12.faces[i*3+1].materialIndex = i
    geometry12.faces[i*3+2].materialIndex = i
    geometry12.faceVertexUvs[0][i*3] = [new THREE.Vector2(-0.45,0.81), new THREE.Vector2(-0.09,-0.31), new THREE.Vector2(0.5,1.5)]
    geometry12.faceVertexUvs[0][i*3+1] = [new THREE.Vector2(-0.09,-0.31), new THREE.Vector2(1.09,-0.31), new THREE.Vector2(0.5,1.5)]
    geometry12.faceVertexUvs[0][i*3+2] = [new THREE.Vector2(1.09,-0.31), new THREE.Vector2(1.45,0.81), new THREE.Vector2(0.5,1.5)]
 }
const geometry20 = new THREE.IcosahedronGeometry(0.5)

for (let i = 0; i < 20; i++) {
      geometry20.faces[i].materialIndex = i;
      geometry20.faceVertexUvs[0][i] = [new THREE.Vector2(1.5,0), new THREE.Vector2(0.5,1.5), new THREE.Vector2(-0.5,0)]
 }
 
 let geometry6 = new THREE.BoxGeometry(0.5,0.5,0.5)

let geometry10 = new THREE.PolyhedronGeometry(vertices10, faces10, 0.5, 0)
for (let i = 0; i < 10; i++) {
    if (i < 5 && i != 0) {
        geometry10.faces[i*2].materialIndex = i;
        geometry10.faces[i*2-1].materialIndex = i;
    } else {
        geometry10.faces[i*2+1].materialIndex = i;
        geometry10.faces[i*2].materialIndex = i;  
    }
    if (i%2 == 0) {
        geometry10.faceVertexUvs[0][i] = [new THREE.Vector2(0.5,1.3), new THREE.Vector2(-0.5,1.1), new THREE.Vector2(0.5,-0.4)]
        geometry10.faceVertexUvs[0][i+10] = [new THREE.Vector2(0.5,1.3), new THREE.Vector2(-0.5,1.1), new THREE.Vector2(0.5,-0.4)]
    } else {
    geometry10.faceVertexUvs[0][i] = [new THREE.Vector2(1.5,1.1), new THREE.Vector2(0.5,1.3), new THREE.Vector2(0.5,-0.4)]
    geometry10.faceVertexUvs[0][i+10] = [new THREE.Vector2(1.5,1.1), new THREE.Vector2(0.5,1.3), new THREE.Vector2(0.5,-0.4)]
    }
}

// https://discoverthreejs.com/book/first-steps/textures-intro/
// https://htmlcolorcodes.com/color-picker/
// https://www.w3schools.com/tags/ref_canvas.asp
// https://www.w3schools.com/graphics/canvas_text.asp

let dice = {}

let customDiceNum = 0

function addDiceSet (name, textureRegular, texture4) {
    dice[name + "D4"] = {}
    dice[name + "D6"] = {}
    dice[name + "D10"] = {}
    dice[name + "D10p"] = {}
    dice[name + "D12"] = {}
    dice[name + "D20"] = {}
    dice[name + "D8"] = {}
    dice[name + "D4"].numSides = 4;
    dice[name + "D4"].geo = geometry4;
    dice[name + "D4"].mat = texture4;
    dice[name + "D6"].numSides = 6;
    dice[name + "D6"].geo = new THREE.BoxGeometry(0.5,0.5,0.5);
    dice[name + "D6"].mat = textureRegular.filter(function(texture, id) {return id < 6});
    dice[name + "D8"].numSides = 8;
    dice[name + "D8"].geo = geometry8;
    dice[name + "D8"].mat = textureRegular.filter(function(texture, id) {return id < 8});
    dice[name + "D10"].numSides = 10;
    dice[name + "D10"].geo = geometry10;
    dice[name + "D10"].mat = textureRegular.filter(function(texture, id) {return id < 10});
    dice[name + "D10p"].numSides = 10;
    dice[name + "D10p"].geo = geometry10;
    dice[name + "D10p"].mat = textureRegular.filter(function(texture, id) {return id <= 30 && id >= 20});
    dice[name + "D12"].numSides = 12;
    dice[name + "D12"].geo = geometry12;
    dice[name + "D12"].mat = textureRegular.filter(function(texture, id) {return id < 12});
    dice[name + "D20"].numSides = 20;
    dice[name + "D20"].geo = geometry20;
    dice[name + "D20"].mat = textureRegular.filter(function(texture, id) {return id < 20});
}

const goldDiceTextures = makeDiceMaterialCanvas("#B09841", "#63541e", "Garamond", 0, 1, 0.1, 0)
const goldDiceTextures4 = makeDiceMaterialCanvas4("#B09841", "#63541e", "Garamond", 0, 1, 0.1, 0)
const tealGlossyTextures = makeDiceMaterialCanvas("#032e38", "#E1E5E5", "Arial", 0.3, 0.2, 1, 0)
const tealGlossyTextures4 = makeDiceMaterialCanvas4("#032e38", "#E1E5E5", "Arial", 0.3, 0.2, 1, 0)
const blackAndRedTextures = makeDiceMaterialCanvas("#000000", "#ff0000", "Garamond", 1, 0, 1, 0.7)
const blackAndRedTextures4 = makeDiceMaterialCanvas4("#000000", "#ff0000", "Garamond", 1, 0, 1, 0.7)

addDiceSet("gold", goldDiceTextures, goldDiceTextures4)
addDiceSet("tealGlossy", tealGlossyTextures, tealGlossyTextures4)
addDiceSet("blackAndRed", blackAndRedTextures, blackAndRedTextures4)

for (let i = 0; i < LSDiceList.length; i++) {
    customDiceNum++
    const diceSetMaterialRegular = makeDiceMaterialCanvas(LSDiceList[i][1], LSDiceList[i][2], LSDiceList[i][3], LSDiceList[i][4], LSDiceList[i][5], LSDiceList[i][6], LSDiceList[i][7])
    const diceSetMaterial4 = makeDiceMaterialCanvas4(LSDiceList[i][1], LSDiceList[i][2], LSDiceList[i][3], LSDiceList[i][4], LSDiceList[i][5], LSDiceList[i][6], LSDiceList[i][7])
    addDiceSet("customSet" + customDiceNum, diceSetMaterialRegular, diceSetMaterial4)
    document.getElementById("diceSetChoice").innerHTML += ('<option value="' + ("customSet" + customDiceNum) + '">' + LSDiceList[i][0] + '</option>')
}

function createCustomDice(name, backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness) {
    const diceSetMaterialRegular = makeDiceMaterialCanvas(backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness)
    const diceSetMaterial4 = makeDiceMaterialCanvas4(backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness)
    customDiceNum++
    addDiceSet("customSet" + customDiceNum, diceSetMaterialRegular, diceSetMaterial4)
    document.getElementById("diceSetChoice").innerHTML += ('<option value="' + ("customSet" + customDiceNum) + '">' + name + '</option>')
    let tempList = [name, backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness]
    LSDiceList.push(tempList)
    console.log(JSON.parse(JSON.stringify(LSDiceList)))
    localStorage.setItem("dice", JSON.stringify(LSDiceList))
}

export {dice, createCustomDice}