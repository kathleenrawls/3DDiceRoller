import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js"
import {dice, createCustomDice} from "/3DDiceRoller/diceInfo.js"
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/environments/RoomEnvironment.js'
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm';

let currentDiceList = []

document.getElementById("roll").addEventListener("click", function () {
    rollDie(currentDiceList)
})
document.getElementById("menu").addEventListener("click", function () {
    document.getElementById("menuDiv").style.width = "190px"
})
document.getElementById("sweep").addEventListener("click", function () {
    clearBoard()
})
document.getElementById("reset").addEventListener("click", function () {
    clearBoard()
    let storageElement = document.getElementById("bottomRow")
    for (let j = 0; j < storageElement.children.length; j++) {
        storageElement.children[j].children[0].innerHTML = ""
    }
    updateDiceList()
    document.getElementById("numDisplay").children[0].innerHTML = 0
})
document.getElementById("menuCloseBtn").addEventListener("click", function () {
    document.getElementById("menuDiv").style.width = "0"
})
document.getElementById("diceSetChoice").addEventListener("change", function (e) {
    currentSet = e.target.value
    updateDiceList()
})
document.getElementById("environmentChoice").addEventListener("change", function (e) {
    hdriLoader.load( ('/3DDiceRoller/resources/' + e.target.value), function ( texture ) {
        const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
        texture.dispose(); 
        scene.environment = envMap
        scene.background = envMap
    } );
})
document.getElementById("autosweepChoice").addEventListener("change", function (e) {
    autosweepValue = e.target.checked
})
document.getElementById("autoreadChoice").addEventListener("change", function (e) {
    autosumValue = e.target.checked
    document.getElementById("numDisplay").children[0].innerHTML = ""
})
document.getElementById("visibleFloorChoice").addEventListener("change", function (e) {
    floor.material.visible = e.target.checked
})
document.getElementById("closeBuilder").addEventListener("click", function () {
    document.getElementById("diceBuilderContainer").style.display = "none"
})
document.getElementById("addDiceSetBtn").addEventListener("click", function () {
    document.getElementById("diceBuilderContainer").style.display = "block"
})

let currentSet = document.getElementById("diceSetChoice").value
let autosweepValue = document.getElementById("autosweepChoice").children[1].checked
let autosumValue = document.getElementById("autoreadChoice").children[1].checked

function updateDiceList() {
    currentDiceList = []
    for (let i = 0; i < 7; i++) {
        let storageElement = document.getElementById("bottomRow").children[i]
        for (let j = 0; j < storageElement.children[0].innerHTML; j++) {
            currentDiceList.push(currentSet + storageElement.children[1].innerHTML)
        }
    }
}

document.addEventListener("click", function(e) {
    if (e.target.className == "diceSelector") {
        let rect = e.target.getBoundingClientRect()
        let clickLocRelative = e.clientX - rect.x - (rect.width/2)
        if (clickLocRelative > 0) {
            e.target.children[0].innerHTML++;
        } else {
            e.target.children[0].innerHTML--;
        }
        updateDiceList()
    } else if (e.target.parentElement.className == "diceSelector") {
        if (e.target == e.target.parentElement.children[0]) {
            // roll total number of dice
            let tempToRoll = []
            for (let i = 0; i < e.target.innerHTML; i++) {
                tempToRoll.push(currentSet + e.target.parentElement.children[1].innerHTML)
            }
            rollDie(tempToRoll)
        } else {
            // roll singular die
            rollDie([currentSet + e.target.innerHTML])
        }
    }
})

let delta
let clock = new THREE.Clock()

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);
const camera2 = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style["user-select"] = "none"
document.body.appendChild( renderer.domElement );
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
}

const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize( window.innerWidth, window.innerHeight );
renderer2.domElement.style["user-select"] = "none"
document.getElementById("diceBuilderContainer").appendChild(renderer2.domElement);
window.onresize = function () {
    renderer2.setSize(window.innerWidth, window.innerHeight)
    camera2.aspect = window.innerWidth/window.innerHeight
    camera2.updateProjectionMatrix()
}

const geometry123 = new THREE.IcosahedronGeometry(1);
for (let i = 0; i < 20; i++) {
      geometry123.faces[i].materialIndex = i;
      geometry123.faceVertexUvs[0][i] = [new THREE.Vector2(1.5,0), new THREE.Vector2(0.5,1.5), new THREE.Vector2(-0.5,0)]
 }
 
let material123 = [];
function updateTestMaterial(backgroundColor, textColor, font, roughness, metalness, clearcoat, clearcoatRoughness) {
    material123 = []
  for (let i = 1; i <= 20; i++) {
    let c = document.createElement("canvas");
    c.id = "canvasDiceBuilder" + i
    c.width = 60;
    c.height = 60;
    let ctx = c.getContext("2d");
    ctx.fillStyle = backgroundColor; // REPLACE
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor; // REPLACE
    ctx.font = "bold 34px " + font; // REPLACE
    let text = i;
    if (i == 6 || i == 9) {
        ctx.beginPath();
        ctx.strokeStyle = textColor; // REPLACE
        ctx.lineWidth = 3;
        ctx.moveTo(20,45);
        ctx.lineTo(40,45);
        ctx.stroke();
    }
    ctx.fillText(text, c.width * 0.5, c.height * 0.5);
    let tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true
    const testMaterial = new THREE.MeshPhysicalMaterial()
    testMaterial.map = tex
    testMaterial.roughness = roughness; // REPLACE
    testMaterial.metalness = metalness; // REPLACE
    testMaterial.clearcoat = clearcoat; // REPLACE
    testMaterial.clearcoatRoughness = clearcoatRoughness; // REPLACE
    material123.push(testMaterial)
  }
}
updateTestMaterial("#ffffff", "#000000", "Garamond", 0, 0, 0, 0)
const cube = new THREE.Mesh( geometry123, material123 );
scene2.add( cube );

let currentDiceParameters = {
    name: "Custom Set",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    font: "Garamond",
    roughness: 0,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0,
    submit: function () {
        createCustomDice(currentDiceParameters.name, currentDiceParameters.backgroundColor, currentDiceParameters.textColor, currentDiceParameters.font, currentDiceParameters.roughness, currentDiceParameters.metalness, currentDiceParameters.clearcoat, currentDiceParameters.clearcoatRoughness)
        alert("Custom dice set (" + currentDiceParameters.name + ") has been created")
    }
}

const gui = new GUI();
document.getElementById("diceBuilderContainer").appendChild(gui.domElement); // Append to the new parent
// gui.add( { value: 1 }, 'value', 0, 10 );
gui.add(currentDiceParameters, 'name').name("Dice Set Name")
gui.addColor(currentDiceParameters, 'backgroundColor').name('Background Color')
gui.addColor(currentDiceParameters, 'textColor').name('Text Color')
gui.add(currentDiceParameters, 'font').name("Font")
gui.add(currentDiceParameters, "roughness", 0, 1).name("Roughness")
gui.add(currentDiceParameters, "metalness", 0, 1).name("Metalness")
gui.add(currentDiceParameters, "clearcoat", 0, 1).name("Clearcoat")
gui.add(currentDiceParameters, "clearcoatRoughness", 0, 1).name("Clearcoat Roughness")
gui.add(currentDiceParameters, "submit")
gui.onChange(event => {
    updateTestMaterial(currentDiceParameters.backgroundColor, currentDiceParameters.textColor, currentDiceParameters.font, currentDiceParameters.roughness, currentDiceParameters.metalness, currentDiceParameters.clearcoat, currentDiceParameters.clearcoatRoughness)
    cube.material = material123
})

camera2.position.set(0, 0, 2);
cube.rotation.set(2,1.2,0)







// let roomEnvironment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator( renderer );
const pmremGenerator2 = new THREE.PMREMGenerator( renderer2 );
// scene.background = pmremGenerator.fromScene( roomEnvironment ).texture;
// scene.environment = pmremGenerator.fromScene( roomEnvironment ).texture;
const hdriLoader = new THREE.TextureLoader()
hdriLoader.load( '/3DDiceRoller/resources/blueIndoorEnvironmentMap.jpg', function ( texture ) {
  const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
  const envMap2 = pmremGenerator2.fromEquirectangular( texture ).texture;
  texture.dispose(); 
  scene.environment = envMap
  scene.background = envMap
  scene2.environment = envMap2
  scene2.background = envMap2
} );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer2.toneMapping = THREE.LinearToneMapping;
renderer2.toneMappingExposure = 1.3;
renderer2.outputEncoding = THREE.sRGBEncoding;

let controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI/2 -0.05
camera.position.set(0, 5, 3);

const mouse = new THREE.Vector2()
const raycaster2 = new THREE.Raycaster()

function getUpFace(intersectedObject) {
    var worldNormal = new THREE.Vector3();
            let upFace = -1;
            if (intersectedObject.name.includes("D4")) {
                for (let i = 0; i < intersectedObject.geometry.faces.length; i++) {
                    worldNormal.copy( intersectedObject.geometry.faces[i].normal).applyMatrix3( new THREE.Matrix3().getNormalMatrix(intersectedObject.matrixWorld))
                    let value = worldNormal.dot(new THREE.Vector3(0,-1,0))
                    if (value >= 0.98) {
                        upFace = intersectedObject.geometry.faces[i].materialIndex + 1
                        switch (upFace) {
                            case 4:
                                upFace = 1;
                                break;
                            case 1:
                                upFace = 4;
                                break;
                        }
                        break
                    }
                }
            } else if (intersectedObject.name.includes("D10p")) {
                for (let i = 0; i < intersectedObject.geometry.faces.length; i++) {
                    worldNormal.copy( intersectedObject.geometry.faces[i].normal).applyMatrix3( new THREE.Matrix3().getNormalMatrix(intersectedObject.matrixWorld))
                    let value = worldNormal.dot(new THREE.Vector3(0,1,0))
                    if (value >= 0.98) {
                        upFace = (intersectedObject.geometry.faces[i].materialIndex + "0") * 1
                        break
                    }
                }
            } else {
                for (let i = 0; i < intersectedObject.geometry.faces.length; i++) {
                    worldNormal.copy( intersectedObject.geometry.faces[i].normal).applyMatrix3( new THREE.Matrix3().getNormalMatrix(intersectedObject.matrixWorld))
                    let value = worldNormal.dot(new THREE.Vector3(0,1,0))
                    if (value >= 0.98) {
                        upFace = intersectedObject.geometry.faces[i].materialIndex + 1
                        break
                    }
                }
            }
            return upFace
}

document.addEventListener("dblclick", () => {
    let sum = 0;
    scene.traverse(function (node) {
        if (node.name != "floor" && node.isMesh) {
            let upFace = (getUpFace(node))
            if (upFace != -1) {
                sum += upFace
            }
    }
    })
    document.getElementById("numDisplay").children[0].innerHTML = sum * 1
})

document.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
        raycaster2.setFromCamera(mouse, camera)
        let intersects = raycaster2.intersectObject(scene, true)
        if (intersects.length > 0 && intersects[0].object.name != "floor") {
          let intersectedObject = intersects[0].object
          scene.remove(intersectedObject)
          world.removeBody(intersectedObject.body)
          if (autosumValue) {
              let tempSum = document.getElementById("numDisplay").children[0].innerHTML * 1
              tempSum += getUpFace(intersectedObject)
              document.getElementById("numDisplay").children[0].innerHTML = tempSum
          } else {
              document.getElementById("numDisplay").children[0].innerHTML += " " + getUpFace(intersectedObject)
          }
        }
      })

renderer.shadowMap.enabled = true;

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// const directionLight = new THREE.DirectionalLight(0xffffff, 1)
// directionLight.position.set(0, -2, 0)
// scene.add(directionLight)
const directionLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionLight2)
directionLight2.position.set(1,1,5)
directionLight2.castShadow = true;

const floorGeo = new THREE.PlaneGeometry(100,100)
const floorMat = new THREE.MeshPhysicalMaterial({color: 0xffffff})
floorMat.visible = document.getElementById("visibleFloorChoice").children[1].checked
floorMat.needsUpdate = true
// floorMat.envMap = pmremGenerator.fromScene( roomEnvironment ).texture;
// floorMat.envMapIntensity = 0.8;
floorMat.roughness = 0.2;
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = -Math.PI/2
floor.position.y = 0
floor.name = "floor"
scene.add(floor)
floor.receiveShadow = true;
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
   mass: 0
})
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
planeBody.id = 123
world.addBody(planeBody)

// MATERIAL TESTING
const sphereGeo = new THREE.SphereGeometry(1,32,16);
const sphereMat = new THREE.MeshPhysicalMaterial()
sphereMat.reflectivity = 0;
sphereMat.roughness = 0;
sphereMat.metalness = 0;
sphereMat.color = new THREE.Color(0x049ef4);//0x8A5A31
sphereMat.ior = 1;
sphereMat.iridescence = 1;
sphereMat.iridescenceIOR = 2
let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
sphereMesh.name = "floor"
// scene.add(sphereMesh)
sphereMesh.position.y = 3

function clearBoard() {
    do {
        scene.remove(scene.children[1])
    } while (scene.children.length > 1)
    for (let i = 0; i < world.bodies.length; i++) {
        if (world.bodies[i].id != 123) {
            world.removeBody(world.bodies[i])
        }
    }
}

function rollDie(diceList) { // array of dice
    if (autosweepValue) {
        clearBoard();
    }
    for (var i = 0; i < diceList.length; i++) {
    let d
    const diceVert = dice[diceList[i]].geo.vertices.map(function (pt) {
        return new CANNON.Vec3(pt.x, pt.y, pt.z)
    })
    const diceFaces = dice[diceList[i]].geo.faces.map(function (face) {
        return [face.a, face.b, face.c]
    })
    const diceShape = new CANNON.ConvexPolyhedron({vertices: diceVert, faces: diceFaces})
    d = new THREE.Mesh(dice[diceList[i]].geo, dice[diceList[i]].mat)
        d.position.y = 2
        d.position.x = 2
        d.name = diceList[i] + i
        scene.add(d)
        d.castShadow = true;
        // d.material.envMap = pmremGenerator.fromScene( roomEnvironment ).texture;
        // d.material.envMapIntensity = 0.5;
        const diceBody = new CANNON.Body({
            mass: 1
        })
        diceBody.addShape(diceShape)
        world.addBody(diceBody)
        d.body = diceBody
    d.body.position.y = 4+i
    d.body.position.x = 4+(i*0.25)
    d.body.position.z = i/2
    d.body.velocity.set(-4,0,0)
    d.body.angularVelocity.set(Math.random()*20-5,Math.random()*20-5,Math.random()*20-5)
    }
}

renderer.setAnimationLoop( animate );
renderer2.setAnimationLoop( animate2 )

function animate2() {
    renderer2.render(scene2, camera2)
}

function animate() {
    controls.update()
    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)
    scene.traverse(function (node) {
        if (node.name != "floor" && node.isMesh) {
        var D4 = node
        D4.position.set(D4.body.position.x, D4.body.position.y, D4.body.position.z)
       D4.quaternion.set(
         D4.body.quaternion.x,
         D4.body.quaternion.y,
         D4.body.quaternion.z,
         D4.body.quaternion.w
       )
    }
    })
    render()
}

function render() {
    renderer.render(scene, camera)
}
