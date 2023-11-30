import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

// controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { MapControls } from 'three/examples/jsm/controls/MapControls'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// addon
import { ModelProvider } from './provider/ModelProvider'
import { CityProvider } from './provider/CityProvider'

export class Loader {
  public key: string

  public container: HTMLElement
  public getScale: Function
  public renderRequestAnimationFrame: any

  // basic instance
  public renderer: THREE.WebGLRenderer
  public camera: THREE.PerspectiveCamera
  public scene: THREE.Scene
  public controls: OrbitControls
  public clock: THREE.Clock

  // light
  public ambientLight: THREE.AmbientLight
  public directionalLight: THREE.DirectionalLight
  public spotLight: THREE.SpotLight

  // addon
  public addon: Record<string, any>

  // model
  public models: ModelProvider[]

  constructor(option) {
    this.key = option.key

    this.container = option.container
    this.getScale = option.getScale
    this.renderRequestAnimationFrame = null

    this.renderer = null
    this.camera = null
    this.scene = null
    this.controls = null
    this.clock = new THREE.Clock()

    this.ambientLight = null
    this.directionalLight = null
    this.spotLight = null

    this.addon = {
      provider: {
        city: new CityProvider({ instance: this }),
      },
    }

    this.models = []
  }

  async init() {
    this.initRender()
    this.initCamera()
    this.initScene()
    this.initControls()
    this.initLight()
    this.initEventListener()
    this.animate()
  }

  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)

    const { width, height } = this.getContainerRect()
    this.renderer.setSize(width, height)

    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.autoClear = true
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.renderer.toneMappingExposure = 2
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)
  }

  initCamera() {
    const { width, height } = this.getContainerRect()
    this.camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 20000)
    this.camera.position.set(0, 200, 0)
  }

  initScene() {
    this.scene = new THREE.Scene()
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.25
  }

  initLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff)
    this.scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    this.directionalLight.castShadow = true
    this.scene.add(this.directionalLight)

    const { width, height } = this.getContainerRect()
    this.spotLight = new THREE.SpotLight(0xffffff)
    this.spotLight.castShadow = true
    this.spotLight.shadow.mapSize.width = width
    this.spotLight.shadow.mapSize.height = height
    this.spotLight.shadow.camera.near = 1
    this.spotLight.shadow.camera.far = 10
    this.scene.add(this.spotLight)
  }

  initEventListener() {
    this.container.addEventListener('click', this.onClick.bind(this))
  }

  animate() {
    this.renderRequestAnimationFrame = requestAnimationFrame(() => this.animate())

    this.controls.update()
    this.renderer.render(this.scene, this.camera)

    // update model animate
    this.models.forEach((model) => {
      model.animate()
    })
    TWEEN.update()
  }

  resize() {
    const { width, height } = this.getContainerRect()

    this.camera.aspect = width / height

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)

    // camera
    this.spotLight.shadow.mapSize.width = width
    this.spotLight.shadow.mapSize.height = height
  }

  onClick() {}

  getContainerRect() {
    const rect = this.container.getBoundingClientRect()
    const scale = this.getScale()

    return {
      width: rect.width / scale,
      height: rect.height / scale,
    }
  }

  setAmbientLight({ color, intensity }) {
    this.ambientLight.color.set(color)
    this.ambientLight.intensity = intensity
  }

  setDirectionalLight({ color, intensity, horizontal, vertical, sistance }) {
    this.directionalLight.color.set(color)
    this.directionalLight.intensity = intensity
    const { x, y, z } = this.getLightPosition(horizontal, vertical, sistance)
    this.directionalLight.position.set(x, y, z)
  }

  setSpotLight({
    color,
    intensity,
    horizontal,
    vertical,
    sistance,
    angle,
    penumbra,
    shadowFocus,
    distance,
  }) {
    this.spotLight.color.set(color)
    this.spotLight.intensity = intensity
    const { x, y, z } = this.getLightPosition(horizontal, vertical, sistance)
    this.spotLight.position.set(x, y, z)

    this.spotLight.angle = angle
    this.spotLight.penumbra = penumbra
    this.spotLight.shadow.focus = shadowFocus
    this.spotLight.distance = distance
  }

  getLightPosition(horizontal, vertical, sistance) {
    const x = sistance * Math.sin(horizontal) * Math.cos(vertical)
    const y = sistance * Math.sin(vertical)
    const z = sistance * Math.cos(horizontal) * Math.cos(vertical)
    return { x, y, z }
  }

  setSphereBackground(url) {
    const meshName = `sphere_background_${this.key}`

    const backgroundMesh = this.scene.getObjectByName(meshName)
    if (backgroundMesh) {
      this.scene.remove(backgroundMesh)
    }

    const sphereGeometry = new THREE.SphereGeometry(500, 50, 50)
    sphereGeometry.scale(-1, 1, 1)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(url),
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.name = meshName
    this.scene.add(sphere)
  }

  setHdrBackground(hdr) {
    new RGBELoader().load(URL.createObjectURL(hdr), (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture
    })
  }

  async loadModel(model, option) {
    const modelInstance = new ModelProvider({
      instance: this,
      model,
      loadOption: option,
    })
    this.models.push(modelInstance)
  }

  destroy() {
    try {
      cancelAnimationFrame(this.renderRequestAnimationFrame)
      this.renderRequestAnimationFrame = null

      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.content = null
      this.renderer = null
      this.camera = null

      this.scene.traverse((child) => {
        if (child.material) {
          child.material.dispose()
        }
        if (child.geometry) {
          child.geometry.dispose()
        }
        child = null
      })
      this.scene = null
    } catch (error) {}
  }
}
