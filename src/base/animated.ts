import {AnimationAction, AnimationMixer} from 'three'
import {Model} from './model'

export abstract class Animated extends Model {
  protected mixer?: AnimationMixer
  protected actions: AnimationAction[] = []

  abstract update(deltaTime: number): void

  async loadModel(path: string) {
    return this.load(path).then((gltf) => {
      this.mixer = new AnimationMixer(gltf.scene)

      for (const animation of this.animations) {
        this.actions.push(this.mixer.clipAction(animation))
      }

      return gltf
    })
  }

  protected activateAllActions(weight: number) {
    this.actions.forEach((action) => {
      action.enabled = true
      action.setEffectiveWeight(weight)
      action.play()
    })
  }

  protected deActivateAllActions(weight: number) {
    this.actions.forEach((action) => {
      action.setEffectiveWeight(weight)
      action.stopFading()
    })
  }
}
