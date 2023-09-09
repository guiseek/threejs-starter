import {Loader} from './loader'

export abstract class Model extends Loader {
  abstract override name: string
  abstract path: string

  async initialize() {
    return this.load(this.path).then((gltf) => {
      this.add(gltf.scene)
      return gltf
    })
  }
}
