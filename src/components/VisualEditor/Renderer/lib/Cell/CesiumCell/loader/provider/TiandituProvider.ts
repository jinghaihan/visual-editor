import * as Cesium from 'cesium'
import { ColorFilter } from '../utils'

export class TiandituProvider {
  public token: string

  public viewer: Cesium.Viewer

  public colorFilter: ColorFilter

  constructor(option) {
    this.token = option.token

    this.viewer = option.viewer

    this.colorFilter = option.colorFilter
  }

  getImageryProvider() {
    const baseUrl = 'http://t{s}.tianditu.gov.cn'

    const tiandituVecImageryProvider = new Cesium.UrlTemplateImageryProvider({
      // name: 'tiandituVec',
      url:
        baseUrl +
        '/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        this.token,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    })

    const tiandituCvaImageryProvider = new Cesium.UrlTemplateImageryProvider({
      // name: 'tiandituCva',
      url:
        baseUrl +
        '/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        this.token,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    })

    const tiandituImgImageryProvider = new Cesium.UrlTemplateImageryProvider({
      // name: 'tiandituImg',
      url:
        baseUrl +
        '/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        this.token,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    })

    const tiandituCiaImageryProvider = new Cesium.UrlTemplateImageryProvider({
      // name: 'tiandituCia',
      url:
        baseUrl +
        '/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        this.token,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    })

    return {
      tiandituVecImageryProvider,
      tiandituCvaImageryProvider,
      tiandituImgImageryProvider,
      tiandituCiaImageryProvider,
    }
  }

  useVecImagery() {
    this.removeBaseLayer()

    const { tiandituVecImageryProvider, tiandituCvaImageryProvider } = this.getImageryProvider()
    this.viewer.imageryLayers.addImageryProvider(tiandituVecImageryProvider)
    this.viewer.imageryLayers.addImageryProvider(tiandituCvaImageryProvider)

    this.colorFilter.mapFilter({
      index: 1,
      filterRgb: [60, 145, 172],
    })
  }

  useImgImagery() {
    this.removeBaseLayer()

    const { tiandituImgImageryProvider, tiandituCiaImageryProvider } = this.getImageryProvider()
    this.viewer.imageryLayers.addImageryProvider(tiandituImgImageryProvider)
    this.viewer.imageryLayers.addImageryProvider(tiandituCiaImageryProvider)
  }

  removeBaseLayer() {
    for (let i = 0; i <= 1; i++) {
      const layer = this.viewer.imageryLayers.get(i)
      if (layer) {
        this.viewer.imageryLayers.remove(layer)
      }
    }
  }
}
