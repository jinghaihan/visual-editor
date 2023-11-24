import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

export class AnimateHandler {
  public scene: Function
  public camera: Function
  public controls: Function

  public defaultAnimate: string
  public clipAction: THREE.AnimationMixer.ClipAction
  public duration: number

  constructor(option) {
    const { instance } = option
    this.scene = () => {
      return instance.scene
    }
    this.camera = () => {
      return instance.camera
    }
    this.controls = () => {
      return instance.controls
    }
    this.defaultAnimate = ''
    this.clipAction = null
    this.duration = 0
  }

  start(instance) {
    this.defaultAnimate = instance.modelAnimations.length ? instance.modelAnimations[0].name : ''

    if (this.defaultAnimate) {
      instance.animationMixer = new THREE.AnimationMixer(instance.model)

      const clip = THREE.AnimationClip.findByName(instance.modelAnimations, this.defaultAnimate)
      this.duration = clip.duration

      if (clip) {
        this.clipAction = instance.animationMixer.clipAction(clip)
        this.clipAction.setLoop(THREE.LoopRepeat)
        this.clipAction.play()
      }
    }
  }

  playClipTrack(index) {
    if (this.clipAction) {
      this.duration = this.clipAction._clip.duration
      const startTime = index * this.duration

      this.clipAction.startAt(startTime)
      this.clipAction.play()
    }
  }

  changePerspective(perspective, duration) {
    const camera = this.camera()
    const controls = this.controls()
    const startPos = camera.position

    const { position, target } = perspective

    new TWEEN.Tween(startPos)
      .to(position, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.position.set(startPos.x, startPos.y, startPos.z)
        controls.target.set(target.x, target.y, target.z)
      })
      .start()
  }
}
