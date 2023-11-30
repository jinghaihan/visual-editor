import { isString, isNaN, flattenDepth } from 'lodash-es'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import CesiumNavigation from 'cesium-navigation-es6'
import { TiandituProvider } from './provider/TiandituProvider'
import { ColorFilter } from './utils'
import { hexToRgb } from '@/utils/style'

export class Loader {
  public key: string
  public selector: string

  public viewer: Cesium.Viewer | null
  public eventHandler: Cesium.ScreenSpaceEventHandler | null

  public token: Record<string, string>

  public addon: Record<string, any>
  public variable: any

  constructor(option) {
    this.key = option.key
    this.selector = option.selector

    this.viewer = null
    this.eventHandler = null
    this.token = {
      defaultAccessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDM4OGY5Ny02MmU3LTRmYmItYjYxOC0yOTlkMDk3N2U4NWUiLCJpZCI6MTc3MzAwLCJpYXQiOjE2OTk4Njk0NTJ9.7TUHkjVJXjQTZ8meDXtKwX7RmjwWq92wUC6UgxZFDfc',
      tianditu: '222d4ac9ba0e0e71775b4813d9111843',
    }

    this.addon = {}

    this.variable = {
      drawingType: null,
      drawingLine: null,
      drawingPolygon: null,
      drawingPoints: [],
      drawingCoodinates: [],
    }
  }

  init() {
    Cesium.Ion.defaultAccessToken = this.token.defaultAccessToken

    this.initViewer()
    this.initEventHandler()
    this.initAddon()
  }

  initViewer() {
    this.viewer = new Cesium.Viewer(this.selector, {
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
    })

    const creditContainer = this.viewer.cesiumWidget.creditContainer as HTMLElement
    creditContainer.style.display = 'none'
    new CesiumNavigation(this.viewer, {})
  }

  initEventHandler() {
    this.createDrawingLine()
    this.createDrawingPolygon()

    this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer?.scene.canvas)

    // left click event
    this.eventHandler.setInputAction((event) => {
      const pick = this.viewer?.scene.pick(event.position)
      const position = this.getCoordinates(event)

      // entity left click event
      if (Cesium.defined(pick)) {
        console.log('selectedEntity', this.viewer?.selectedEntity)
      }

      // draw point
      if (position && this.variable.drawingType) {
        this.createPoint(position)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // right click event
    this.eventHandler.setInputAction((_event) => {
      this.removeAllDrawingEntities()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // mouse move event
    this.eventHandler.setInputAction((event) => {
      const position = this.getCoordinates(event)

      if (this.variable.drawingCoodinates.length > 1) {
        if (position && position.x) {
          this.variable.drawingCoodinates.push(position)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  removeAllDrawingEntities() {
    this.variable.drawingPoints.forEach((point) => {
      this.viewer?.entities.remove(point)
    })

    this.viewer?.entities.remove(this.variable.drawingLine)
    this.viewer?.entities.remove(this.variable.drawingPolygon)

    this.variable.drawingPoints = []
    this.variable.drawingCoodinates = []
  }

  getCoordinates(event) {
    const ray = this.viewer?.camera.getPickRay(event.position || event.endPosition)
    if (ray) {
      return this.viewer?.scene.globe.pick(ray, this.viewer?.scene)
    }
  }

  createDrawingLine() {
    this.variable.drawingLine = this.viewer?.entities.add({
      id: 'drawingLine',
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return this.variable.drawingCoodinates
        }, false),
        width: 3,
        material: Cesium.Color.RED,
      },
    })
  }

  createDrawingPolygon() {
    this.variable.drawingLine = this.viewer?.entities.add({
      id: 'drawingPolygon',
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this.variable.drawingCoodinates)
        }, false),
        material: Cesium.Color.RED.withAlpha(0.2),
        perPositionHeight: false,
      },
    })
  }

  createPoint(position) {
    const point = this.viewer?.entities.add({
      position,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
    this.variable.drawingPoints.push(point)
    this.variable.drawingCoodinates = this.variable.drawingPoints.map(
      (point) => point.position._value,
    )
  }

  initAddon() {
    // init addon instance
    const colorFilter = new ColorFilter({
      viewer: this.viewer,
    })
    const tiandituProvider = new TiandituProvider({
      token: this.token.tianditu,
      Cesium: Cesium,
      viewer: this.viewer,
      colorFilter,
    })
    tiandituProvider.useImgImagery()

    this.addon = {
      provider: {
        tiandituProvider,
      },
      utils: {
        colorFilter,
      },
    }
  }

  removeDataSources() {
    const dataSources = this.viewer?.dataSources
    if (dataSources) {
      for (let i = 0; i < dataSources.length; i++) {
        dataSources.remove(dataSources.get(i))
      }
    }
  }

  getDataSourceByName(name) {
    const dataSources = this.viewer?.dataSources
    if (dataSources) {
      for (let i = 0; i < dataSources.length; i++) {
        const dataSource = dataSources.get(i)
        if (name === dataSource.name) {
          return dataSource
        }
      }
    }
  }

  destroy() {
    try {
      this.viewer?.destroy()
      this.viewer = null

      this.eventHandler?.destroy()
      this.eventHandler = null
    } catch (error) {}
  }

  extractCoordinates(arr) {
    const chunkSize = 3
    const array = flattenDepth(arr, Infinity)

    const coordinates = [] as number[]
    Array.from({ length: Math.ceil(array.length / chunkSize) }, () =>
      array.splice(0, chunkSize),
    ).map((coordinate: number[]) => {
      coordinates.push(coordinate[0])
      coordinates.push(coordinate[1])
    })

    return coordinates
  }

  async loadBuilding(data, option) {
    if (isString(data)) {
      data = JSON.parse(data)
    }
    this.removeDataSources()

    const { exHeightField, exHeightScale, buildingColor } = option
    const maxHeight = this.getBuildingMaxHeightByGeoJson(data, exHeightField, exHeightScale)

    Cesium.GeoJsonDataSource.load(data).then(async (dataSource) => {
      const entities = dataSource.entities.values
      for (let index = 0; index < entities.length; index++) {
        const entity = entities[index]

        if (entity.polygon && entity.properties) {
          // get building height
          let extrudedHeight = Number(
            entity.properties[exHeightField] ? entity.properties[exHeightField]._value : 1,
          )
          if (isNaN(extrudedHeight)) {
            extrudedHeight = 1
          }
          extrudedHeight = extrudedHeight * exHeightScale

          this.setBuildingPolygonAttr({
            polygon: entity.polygon,
            extrudedHeight,
            maxHeight,
            buildingColor,
          })
        }
      }

      dataSource.name = `building_datasource_${this.key}`
      await this.viewer?.dataSources.add(dataSource)
      await this.viewer?.zoomTo(dataSource)

      this.addon.provider.tiandituProvider.useVecImagery()
    })
  }

  setBuildingPolygonAttr(data) {
    const { polygon, extrudedHeight, maxHeight, buildingColor } = data

    polygon.heightReference = new Cesium.CallbackProperty(() => {
      return Cesium.HeightReference.RELATIVE_TO_GROUND
    }, true)
    polygon.height = new Cesium.CallbackProperty(() => {
      return 0
    }, true)
    polygon.extrudedHeightReference = new Cesium.CallbackProperty(() => {
      return Cesium.HeightReference.RELATIVE_TO_GROUND
    }, true)
    polygon.extrudedHeight = new Cesium.CallbackProperty(() => {
      return extrudedHeight
    }, true)
    polygon.outline = new Cesium.CallbackProperty(() => {
      return true
    }, true)
    polygon.outlineColor = new Cesium.CallbackProperty(() => {
      return Cesium.Color.BLACK
    }, true)

    // @ts-ignore
    polygon.material = this.getColorByExtrudedHeight(extrudedHeight, maxHeight, buildingColor)
  }

  setBuildingColor(color) {
    const dataSource = this.getDataSourceByName(`building_datasource_${this.key}`)
    if (dataSource) {
      const entities = dataSource.entities.values
      const maxHeight = this.getBuildingMaxHeightByEntities(entities)

      for (let index = 0; index < entities.length; index++) {
        const entity = entities[index]

        if (entity.polygon) {
          // @ts-ignore
          entity.polygon.material = this.getColorByExtrudedHeight(
            entity.polygon?.extrudedHeight,
            maxHeight,
            color,
          )
        }
      }
    }
  }

  getColorByExtrudedHeight(height, maxHeight, color) {
    const minColor = hexToRgb('#ffffff')
    const maxColor = hexToRgb(color)

    const t = height / maxHeight

    const r = minColor.r + (maxColor.r - minColor.r) * t
    const g = minColor.g + (maxColor.g - minColor.g) * t
    const b = minColor.b + (maxColor.b - minColor.b) * t

    return Cesium.Color.fromCssColorString(`rgb(${r}, ${g}, ${b})`)
  }

  getBuildingMaxHeightByGeoJson(geoJson, exHeightField, exHeightScale) {
    // get building height scope
    let maxHeight = -Infinity
    geoJson.features.forEach((feature) => {
      const height = (feature.properties[exHeightField] || 1) * exHeightScale
      maxHeight = Math.max(maxHeight, height)
    })

    return maxHeight
  }

  getBuildingMaxHeightByEntities(entities) {
    let maxHeight = -Infinity
    entities.forEach((entity) => {
      if (entity.polygon) {
        maxHeight = Math.max(maxHeight, entity.polygon.extrudedHeight)
      }
    })
    return maxHeight
  }

  // Todo - outline & update building color
  async loadBuildingByPrimitive(data, option) {
    if (isString(data)) {
      data = JSON.parse(data)
    }
    const { exHeightField, exHeightScale, buildingColor } = option
    const maxHeight = this.getBuildingMaxHeightByGeoJson(data, exHeightField, exHeightScale)

    const instances = [] as Cesium.GeometryInstance[]
    data.features.forEach((feature) => {
      const extrudedHeight = (feature.properties[exHeightField] || 1) * exHeightScale
      const coordinates = this.extractCoordinates(feature.geometry.coordinates)

      const geometry = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(coordinates),
        ),
        height: 0,
        extrudedHeight,
      })
      const instance = new Cesium.GeometryInstance({
        geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            this.getColorByExtrudedHeight(extrudedHeight, maxHeight, buildingColor),
          ),
          show: new Cesium.ShowGeometryInstanceAttribute(true),
        },
      })
      instances.push(instance)
    })

    const primitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance(),
    })
    this.addon.provider.tiandituProvider.useVecImagery()
    this.viewer?.scene.primitives.add(primitive)

    console.log(primitive)
  }
}
