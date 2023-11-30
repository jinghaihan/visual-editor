import { BaseCell } from '../BaseCell'
import { Loader } from './loader'

export class CesiumCell extends BaseCell {
  public loader: Loader | null

  constructor(option) {
    super(option)

    this.loader = null
  }

  init() {
    this.loader = new Loader({
      key: this.key,
      selector: `visual-dv-gis-scene-${this.key}`,
    })
    this.loader.init()
  }

  resize() {}

  async updateHandler(diff) {
    const { scene } = diff
    const config = this.configData.style

    if (scene) {
      const { city } = scene

      if (city) {
        if (city.geoJson) {
          const content = await this.$assetsManager.get(city.geoJson)
          this.loader?.loadBuilding(content, {
            exHeightField: config.scene.city.exHeightField,
            exHeightScale: config.scene.city.exHeightScale || 5,
            buildingColor: config.scene.city.buildingColor,
          })

          // this.loader?.loadBuildingByPrimitive(content, {
          //   exHeightField: config.scene.city.exHeightField,
          //   exHeightScale: config.scene.city.exHeightScale || 5,
          //   buildingColor: config.scene.city.buildingColor,
          // })
        }

        if (city.buildingColor) {
          this.loader?.setBuildingColor(city.buildingColor)
        }
      }
    }
  }

  destroy() {
    this.loader?.destroy()
    this.loader = null
  }
}
