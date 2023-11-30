import { isString, isArray, isNumber } from 'lodash-es'
import * as THREE from 'three'
import * as GEOLIB from 'geolib'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const material_ground = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.25,
})

const material_road = new THREE.LineBasicMaterial({
  color: 0x000000,
  transparent: true,
  linewidth: 1,
  opacity: 0.25,
})

const material_water = new THREE.MeshPhongMaterial({
  color: 0x42a5f5,
  transparent: false,
  opacity: 1,
})

const material_green = new THREE.MeshPhongMaterial({
  color: 0x81c784,
  transparent: false,
  opacity: 1,
})

// Get the geojson data from [overpass-turbo](https:// overpass-turbo.eu);

/**
[out:json]
[bbox:{{bbox}}]
[timeout:30];

(
way["building"]({{bbox}});
relation["building"]({{bbox}});

way["highway"]({{bbox}});
relation["highway"]["type"="polygon"]({{bbox}});

way["natural"="water"]({{bbox}});
way["water"="lake"]({{bbox}});
way["natural"="coastline"]({{bbox}});
way["waterway"="riverbank"]({{bbox}});

way["leisure"="park"]({{bbox}});
way["leisure"="garden"]({{bbox}});
);

out;
>;
out qt;
*/

export class CityProvider {
  public scene: Function

  public cityCenter: number[]

  public buildingArray: THREE.ExtrudeGeometry[]
  public roadArray: THREE.ExtrudeGeometry[]
  public waterArray: THREE.ExtrudeGeometry[]
  public greenArray: THREE.ExtrudeGeometry[]

  constructor(option) {
    const { instance } = option
    this.scene = () => {
      return instance.scene
    }

    this.cityCenter = []

    this.buildingArray = []
    this.roadArray = []
    this.waterArray = []
    this.greenArray = []
  }

  // main function
  loadCity(data) {
    // parse geo json string
    if (isString(data)) {
      data = JSON.parse(data)
    }

    // get city center & scope
    this.getCityCenter(data)

    // generate shapes, meshes and lines
    data.features.forEach((element) => {
      this.create3dObjects(element)
    })

    this.spawnBuildings()
    this.spawnRoads()
    this.spawnWater()
    this.spawnGreen()
    this.spawnGround()
  }

  getCityCenter(data) {
    const totalCoordinates = [0.0, 0.0]
    let numFeatures = 0

    data.features.forEach((feature) => {
      const coordinates = feature.geometry.coordinates[0][0]
      if (isArray(coordinates)) {
        if (isNumber(coordinates[0]) && isNumber(coordinates[1])) {
          totalCoordinates[0] += coordinates[0]
          totalCoordinates[1] += coordinates[1]
          numFeatures++
        }
      }
    })

    this.cityCenter = [totalCoordinates[0] / numFeatures, totalCoordinates[1] / numFeatures]
  }

  create3dObjects(data) {
    const coordinates = data.geometry.coordinates
    const properties = data.properties

    if (properties.building) {
      // if data is a building property (if it's a building)
      const building_levels = data.properties['building:levels'] || 1
      // if building:levels property exists use it, otherwise use 1
      this.buildingArray.push(this.generateBuilding(coordinates, building_levels))
    } else if (properties.highway && data.geometry.type != 'Point') {
      const road = this.generateRoad(coordinates, properties)
      if (road != undefined) {
        this.roadArray.push(road)
      }
    } else if (properties.natural) {
      this.waterArray.push(this.generateWater(coordinates, properties))
    } else if (properties.leisure) {
      // test green
      this.greenArray.push(this.generateGreen(coordinates))
    }
  }

  // GENERATE SHAPE AND FILL UP ARRAYS
  generateBuilding(coordinates, height = 1) {
    // each geojson "object" has multiple arrays of coordinates.
    // the first array is the main (outer) building shape
    // the second & third & .. are the "holes" in the building
    let buildingShape, buildingGeometry // main building

    coordinates.forEach((points, index) => {
      // for each building do:
      if (index == 0) {
        // create main building shape
        buildingShape = this.generateShape(points)
      } else {
        // create shape of holes in building
        buildingShape.holes.push(this.generateShape(points))
      }
    })

    // eslint-disable-next-line prefer-const
    buildingGeometry = this.generateGeometry(buildingShape, height)
    return buildingGeometry
  }

  generateRoad(coordinates, _properties, height = 0) {
    const points = [] as number[]

    // check if multi-point road, not a point.
    if (coordinates.length > 1) {
      coordinates.forEach((coordinates) => {
        const coords = this.normalizeCoordinates(coordinates, this.cityCenter)
        points.push(new THREE.Vector3(coords[0], height, coords[1]))
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      geometry.rotateZ(Math.PI)
      return geometry
    } else {
      return undefined
    }
  }

  generateWater(coordinates, _properties, height = 0.007) {
    // each geojson "object" has multiple arrays of coordinates.
    // the first array is the main (outer) building shape
    // the second & third & .. are the "holes" in the building
    let waterShape, waterGeometry // main building

    coordinates.forEach((points, index) => {
      // for each building do:
      if (index == 0) {
        // create main building shape
        waterShape = this.generateShape(points)
      } else {
        // create shape of holes in building
        waterShape.holes.push(this.generateShape(points))
      }
    })

    // eslint-disable-next-line prefer-const
    waterGeometry = this.generateGeometry(waterShape, height)
    return waterGeometry
  }

  generateGreen(coordinates, height = 0) {
    // each geojson "object" has multiple arrays of coordinates.
    // the first array is the main (outer) building shape
    // the second & third & .. are the "holes" in the building
    let greenShape, greenGeometry // main building

    coordinates.forEach((points, index) => {
      // for each building do:
      if (index == 0) {
        // create main building shape
        greenShape = this.generateShape(points)
      } else {
        // create shape of holes in building
        greenShape.holes.push(this.generateShape(points))
      }
    })

    // eslint-disable-next-line prefer-const
    greenGeometry = this.generateGeometry(greenShape, height)
    return greenGeometry
  }

  generateShape(polygon) {
    const shape = new THREE.Shape() // only a single polygon?

    if (isArray(polygon)) {
      polygon.forEach((coordinates, index) => {
        const coords = this.normalizeCoordinates(coordinates, this.cityCenter)
        if (index == 0) {
          shape.moveTo(coords[0], coords[1])
        } else {
          shape.lineTo(coords[0], coords[1])
        }
      })
    }

    return shape
  }

  generateGeometry(shape, height) {
    // let height = 1;
    const geometry = new THREE.ExtrudeGeometry(shape, {
      curveSegments: 1,
      depth: 0.5 * height,
      bevelEnabled: false,
    })

    geometry.rotateX(Math.PI / 2)
    geometry.rotateZ(Math.PI)
    return geometry
  }

  // SPAWN GENERATED OBJECTS
  spawnBuildings() {
    const mergedGeometry = mergeGeometries(this.buildingArray)

    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    })
    const mesh = new THREE.Mesh(mergedGeometry, material)
    mesh.name = 'BUILDINGS'
    mesh.updateMatrix()
    mesh.layers.set(0)
    mesh.frustumCulled = false
    mesh.castShadow = true
    this.scene().add(mesh)
  }

  spawnRoads() {
    this.roadArray.forEach((road, index) => {
      const line = new THREE.Line(road, material_road)
      line.name = 'ROAD' + index
      line.layers.set(1)
      line.frustumCulled = false
      this.scene().add(line)
    })
  }

  spawnWater() {
    const mergedGeometry = mergeGeometries(this.waterArray)

    const mesh = new THREE.Mesh(mergedGeometry, material_water)
    mesh.name = 'WATER'
    mesh.updateMatrix()

    mesh.position.y -= 0.01
    mesh.layers.set(0)
    mesh.frustumCulled = false
    this.scene().add(mesh)
  }

  spawnGreen() {
    const mergedGeometry = mergeGeometries(this.greenArray)

    const mesh = new THREE.Mesh(mergedGeometry, material_green)
    mesh.name = 'GREEN'
    mesh.updateMatrix()

    mesh.position.y -= 0.01
    mesh.layers.set(0)
    mesh.frustumCulled = false
    this.scene().add(mesh)
  }

  spawnGround() {
    const geometry = new THREE.PlaneGeometry(50, 50)

    const plane = new THREE.Mesh(geometry, material_ground)
    plane.receiveShadow = true
    plane.rotation.x = Math.PI / 2
    plane.position.y -= 0.03
    this.scene().add(plane)
  }

  // GENERAL FUNCTION
  normalizeCoordinates(objectPosition, centerPosition) {
    // Get GPS distance
    const dis = GEOLIB.getDistance(objectPosition, centerPosition)

    // Get bearing angle
    const bearing = GEOLIB.getRhumbLineBearing(objectPosition, centerPosition)

    // Calculate X by centerPosi.x + distance * cos(rad)
    const x = centerPosition[0] + dis * Math.cos((bearing * Math.PI) / 180)

    // Calculate Y by centerPosi.y + distance * sin(rad)
    const y = centerPosition[1] + dis * Math.sin((bearing * Math.PI) / 180)

    // Reverse X (it work)
    return [-x / 100, y / 100]
  }
}
