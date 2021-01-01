// http://www.webgl3d.cn/threejs/examples/#webgl_shadowmap
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_shadowmap.html
// 多对象，运动

import * as THREE from 'three'

// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js'

var SHADOW_MAP_WIDTH = 2048
var SHADOW_MAP_HEIGHT = 1024

var FLOOR = -250

var camera, scene, renderer
var container

var mixer
var morphs = []

var light
// var lightShadowMapViewer

var clock = new THREE.Clock()

// var showHUD = false

init()
animate()

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)

  // CAMERA

  camera = new THREE.PerspectiveCamera(23, window.innerWidth / window.innerHeight, 10, 3000)
  camera.position.set(700, 50, 1900)

  // SCENE

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x59472b)
  scene.fog = new THREE.Fog(0x59472b, 1000, 3000)

  // LIGHTS

  var ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient)

  light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 5, 0.3)
  light.position.set(0, 1500, 1000)
  light.target.position.set(0, 0, 0)

  light.castShadow = true
  light.shadow.camera.near = 1200
  light.shadow.camera.far = 2500
  light.shadow.bias = 0.0001

  light.shadow.mapSize.width = SHADOW_MAP_WIDTH
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT

  scene.add(light)

  //   createHUD()
  createScene()

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.autoClear = false

  // shadow

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  // CONTROLS
  //   controls = new FirstPersonControls(camera, renderer.domElement)

  //   controls.lookSpeed = 0.0125
  //   controls.movementSpeed = 500
  //   controls.noFly = false
  //   controls.lookVertical = true

  //   controls.lookAt(scene.position)
}

// function createHUD() {
//   lightShadowMapViewer = new ShadowMapViewer(light)
//   lightShadowMapViewer.position.x = 10
//   lightShadowMapViewer.position.y = window.innerHeight - SHADOW_MAP_HEIGHT / 4 - 10
//   lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4
//   lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4
//   lightShadowMapViewer.update()
// }

function createScene() {
  // GROUND

  var geometry = new THREE.PlaneBufferGeometry(100, 100)
  var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffb851 })

  var ground = new THREE.Mesh(geometry, planeMaterial)

  ground.position.set(0, FLOOR, 0)
  ground.rotation.x = -Math.PI / 2
  ground.scale.set(100, 100, 100)

  ground.castShadow = false
  ground.receiveShadow = true

  scene.add(ground)

  // TEXT
  //   var loader = new THREE.FontLoader()
  //   loader.load('static/fonts/helvetiker_bold.typeface.json', function (font) {
  //     var textGeo = new THREE.TextBufferGeometry('THREE.JS', {
  //       font: font,

  //       size: 200,
  //       height: 50,
  //       curveSegments: 12,

  //       bevelThickness: 2,
  //       bevelSize: 5,
  //       bevelEnabled: true
  //     })

  //     textGeo.computeBoundingBox()
  //     var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)

  //     var textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0xffffff })

  //     var mesh = new THREE.Mesh(textGeo, textMaterial)
  //     mesh.position.x = centerOffset
  //     mesh.position.y = FLOOR + 67

  //     mesh.castShadow = true
  //     mesh.receiveShadow = true

  //     scene.add(mesh)
  //   })

  // CUBES

  //   var mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1500, 220, 150), planeMaterial)

  //   mesh.position.y = FLOOR - 50
  //   mesh.position.z = 20

  //   mesh.castShadow = true
  //   mesh.receiveShadow = true

  //   scene.add(mesh)

  //   var mesh2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1600, 170, 250), planeMaterial)

  //   mesh2.position.y = FLOOR - 50
  //   mesh2.position.z = 20

  //   mesh2.castShadow = true
  //   mesh2.receiveShadow = true

  //   scene.add(mesh2)

  // MORPHS

  mixer = new THREE.AnimationMixer(scene)

  function addMorph(mesh, clip, speed, duration, x, y, z, fudgeColor) {
    mesh = mesh.clone()
    mesh.material = mesh.material.clone()

    if (fudgeColor) {
      mesh.material.color.offsetHSL(0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25)
    }

    mesh.speed = speed

    mixer
      .clipAction(clip, mesh)
      .setDuration(duration)
      .startAt(-duration * Math.random())
      .play()

    mesh.position.set(x, y, z)

    mesh.rotation.y = Math.PI / 2

    mesh.castShadow = true
    mesh.receiveShadow = true

    scene.add(mesh)

    morphs.push(mesh)
  }

  var loader2 = new GLTFLoader()

  loader2.load('static/models/gltf/Flamingo.glb', function (gltf) {
    var mesh = gltf.scene.children[0]
    var clip = gltf.animations[0]

    addMorph(mesh, clip, 500, 1, 500 - Math.random() * 500, FLOOR + 350, 40)
  })

  loader2.load('static/models/gltf/Horse.glb', function (gltf) {
    var mesh = gltf.scene.children[0]

    var clip = gltf.animations[0]

    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 300, true)
    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 450, true)
    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 600, true)

    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, -300, true)
    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, -450, true)
    addMorph(mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, -600, true)
  })

  loader2.load('static/models/gltf/Stork.glb', function (gltf) {
    var mesh = gltf.scene.children[0]
    var clip = gltf.animations[0]

    addMorph(mesh, clip, 350, 1, 500 - Math.random() * 500, FLOOR + 350, 340)
  })

  loader2.load('static/models/gltf/Parrot.glb', function (gltf) {
    var mesh = gltf.scene.children[0]
    var clip = gltf.animations[0]

    addMorph(mesh, clip, 450, 0.5, 500 - Math.random() * 500, FLOOR + 300, 700)
  })
}

function animate() {
  requestAnimationFrame(animate)

  render()
}

function render() {
  var delta = clock.getDelta()

  mixer.update(delta)

  for (var i = 0; i < morphs.length; i++) {
    var morph = morphs[i]

    morph.position.x += morph.speed * delta

    if (morph.position.x > 2000) {
      morph.position.x = -1000 - Math.random() * 500
    }
  }

  //   controls.update(delta)

  renderer.clear()
  renderer.render(scene, camera)

  // Render debug HUD with shadow map

  //   if (showHUD) {
  //     lightShadowMapViewer.render(renderer)
  //   }
}
