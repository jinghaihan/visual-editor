import * as Cesium from 'cesium'

export class ColorFilter {
  public viewer: Cesium.Viewer
  public cache: Record<string, Record<number, string>>

  constructor(option) {
    this.viewer = option.viewer

    this.cache = {
      mapShader: {},
    }
  }

  mapFilter(option) {
    const layer = this.viewer.imageryLayers.get(option.index || 0)

    layer.brightness = option.brightness || 0.6
    layer.contrast = option.contrast || 1.8
    layer.gamma = option.gamma || 0.3
    layer.saturation = option.saturation || 0
    // layer.hue = option.hue || 1

    const baseFragShader =
      // @ts-ignore
      this.viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources

    for (let i = 0; i < baseFragShader.length; i++) {
      if (!this.cache.mapShader[i]) {
        this.cache.mapShader[i] = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
      }
      const replaceStr = this.cache.mapShader[i]

      if (baseFragShader[i].includes(replaceStr)) {
        let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'

        if (option.invertColor) {
          strT += `
            color.r = 1.0 - color.r;
            color.g = 1.0 - color.g;
            color.b = 1.0 - color.b;
          `
        }

        if (option.filterRgb && option.filterRgb.length > 0) {
          strT += `
            color.r = color.r * ${option.filterRgb[0]}.0 / 255.0;
            color.g = color.g * ${option.filterRgb[1]}.0 / 255.0;
            color.b = color.b * ${option.filterRgb[2]}.0 / 255.0;
          `
        }

        baseFragShader[i] = baseFragShader[i].replace(replaceStr, strT)
        this.cache.mapShader[i] = strT
      }
    }
  }
}
