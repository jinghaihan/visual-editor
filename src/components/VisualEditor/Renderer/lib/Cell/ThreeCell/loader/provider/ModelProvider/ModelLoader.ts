import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export class ModelLoader {
  public loadingManager: THREE.loadingManager
  public loaderMap: Record<string, any>

  constructor() {
    this.loadingManager = new THREE.LoadingManager()
    this.loaderMap = {
      glb: new GLTFLoader(),
      gltf: new GLTFLoader(),
      fbx: new FBXLoader(this.loadingManager),
      obj: new OBJLoader(this.loadingManager),
    }
  }

  load(model, instance, option) {
    return new Promise((resolve) => {
      const fileType = model.name.split('.').pop().toLowerCase()

      const loader = this.loaderMap[fileType]
      if (loader) {
        if (loader instanceof GLTFLoader) {
          const dracoLoader = new DRACOLoader()
          dracoLoader.setDecoderPath('./lib/draco-decoder/')
          loader.setDRACOLoader(dracoLoader)
        }

        loader.load(URL.createObjectURL(model), (datasource) => {
          switch (fileType) {
            case 'glb':
              instance.model = datasource.scene
              instance.modelAnimations = datasource.animations || []
              break
            case 'gltf':
              instance.model = datasource.scene
              instance.modelAnimations = datasource.animations || []
              break
            case 'fbx':
              instance.model = datasource
              instance.modelAnimations = datasource.animations || []
              break
            case 'obj':
              instance.model = datasource
              instance.modelAnimations = datasource.animations || []
              break
          }

          if (option.scale) {
            instance.model.scale.set(option.scale, option.scale, option.scale)
          }

          instance.scene().add(instance.model)
          resolve(datasource)
        })
      }
    })
  }
}
