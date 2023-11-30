import * as THREE from 'three'

import { ModelLoader } from './ModelLoader'
import { AnimateHandler } from './AnimateHandler'

export class ModelProvider {
  public scene: Function
  public camera: Function
  public clock: THREE.Clock

  public model: THREE.Scene
  public modelAnimations: THREE.Scene.Animation[]
  public animationMixer: THREE.AnimationMixer

  public modelLoader: ModelLoader
  public animateHandler: AnimateHandler

  constructor(option) {
    const { instance } = option
    this.scene = () => {
      return instance.scene
    }
    this.camera = () => {
      return instance.camera
    }
    this.clock = instance.clock

    this.model = null
    this.modelAnimations = []
    this.animationMixer = null

    this.modelLoader = new ModelLoader()
    this.animateHandler = new AnimateHandler(option)

    this.init(option)
  }

  async init(option) {
    await this.modelLoader.load(option.model, this, option.loadOption)
    this.animateHandler.start(this)
  }

  animate() {
    if (this.animationMixer) {
      this.animationMixer.update(this.clock.getDelta())
    }
  }
}
