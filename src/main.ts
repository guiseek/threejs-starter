import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {
  Clock,
  Scene,
  WebGLRenderer,
  DirectionalLight,
  PerspectiveCamera,
  AmbientLight,
} from 'three'
import {OldComputer} from './models'
import './style.scss'

const scene = new Scene()
const clock = new Clock()
const stats = new Stats()

const ratio = innerWidth / innerHeight
const cameraParams = [45, ratio, 1, 100000]
const camera = new PerspectiveCamera(...cameraParams)

const renderer = new WebGLRenderer({antialias: true})
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x121214, 1)
renderer.setSize(innerWidth, innerHeight)
container.append(renderer.domElement, stats.dom)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(6, 6, 6)
controls.update()

const directional = new DirectionalLight(0xffffff, 0.6)
const ambient = new AmbientLight(0x404040)

/**
 * Model 👇
 */
const oldComputer = new OldComputer()
oldComputer.initialize()

scene.add(camera, directional, ambient, oldComputer)

/**
 * Game loop
 */
const animate = () => {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  controls.update(delta)
  stats.update()

  renderer.render(scene, camera)
}
animate()

const resizeHandler = () => {
  camera.aspect = ratio
  renderer.setSize(innerWidth, innerHeight)
  camera.updateProjectionMatrix()
}
resizeHandler()
onresize = resizeHandler
