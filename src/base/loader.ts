import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Group} from 'three'

export class Loader extends Group {
  #onLoaded = new Set<Callback>()
  set onLoaded(cb: Callback) {
    this.#onLoaded.add(cb)
  }

  #onLoading = new Set<Callback<ProgressEvent>>()
  set onLoading(cb: Callback<ProgressEvent>) {
    this.#onLoading.add(cb)
  }

  #loader = new GLTFLoader()

  constructor() {
    super()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('assets/js/')
    this.#loader.setDRACOLoader(dracoLoader)
  }

  protected async load(path: string) {
    return this.#loader
      .loadAsync(path, (ev) => {
        for (const onLoading of this.#onLoading) {
          onLoading(ev)
        }
      })
      .finally(() => {
        for (const onLoaded of this.#onLoaded) {
          onLoaded()
        }
      })
  }
}
