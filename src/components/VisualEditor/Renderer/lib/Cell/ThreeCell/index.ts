import { BaseCell } from '../BaseCell'
import { Loader } from './loader'

export class ThreeCell extends BaseCell {
  public loader: Loader | null

  constructor(option) {
    super(option)

    this.loader = null
  }

  init() {
    this.loader = new Loader({
      key: this.key,
      container: this.getComponentRef().$refs.Scene,
      getScale: () => this.paper.configData.variable.scale,
    })
    this.loader.init()
  }

  resize() {
    if (this.loader && 'resize' in this.loader) {
      this.loader.resize()
    }
  }

  async updateHandler(diff) {
    const { background, light, scene } = diff
    const config = this.configData.style

    if (background) {
      const { panorama, hdr } = background

      if (panorama) {
        const content = await this.$assetsManager.get(panorama)
        this.loader?.setSphereBackground(content)
      }

      if (hdr) {
        const content = await this.$assetsManager.get(hdr)
        this.loader?.setHdrBackground(content)
      }
    }

    if (light) {
      const { ambientLight, directionalLight, spotLight } = light

      if (ambientLight) {
        this.loader?.setAmbientLight(config.light.ambientLight)
      }

      if (directionalLight) {
        this.loader?.setDirectionalLight(config.light.directionalLight)
      }

      if (spotLight) {
        this.loader?.setSpotLight(config.light.spotLight)
      }
    }

    if (scene) {
      if (scene.model) {
        const { file } = scene.model

        if (file) {
          const content = await this.$assetsManager.get(file)
          this.loader?.loadModel(content, {
            scale: config.scene.model.scale,
          })
        }
      }

      if (scene.city) {
        const { geoJson } = scene.city

        if (geoJson) {
          const content = await this.$assetsManager.get(geoJson)
          this.loader?.addon.provider.city.loadCity(content)
        }
      }
    }
  }

  destroy() {
    this.loader?.destroy()
    this.loader = null
  }
}
