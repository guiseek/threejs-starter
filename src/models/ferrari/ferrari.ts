import {Object3D, Object3DEventMap, Vector3} from 'three'
import {Control} from '../../base/control'
import {Model} from '../../base/model'
import model from './ferrari.glb?url'
import {Vec3} from 'cannon-es'

/**
 * Configurações pra movimentos complexos
 */
const wheelOptions = {
  radius: 0.5,
  directionLocal: new Vec3(0, -1, 0),
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 1.4,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  axleLocal: new Vec3(0, 0, 1),
  chassisConnectionPointLocal: new Vec3(-1, 0, 1),
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
}

export class Ferrari extends Model {
  name = 'Ferrari'
  path = model

  #speed = {
    min: 0,
    max: 10,
    now: 1,
    acc: 0.1,
  }

  #wheels: Object3D<Object3DEventMap>[] = []

  constructor(readonly control: Control) {
    super()
  }

  async init() {
    return this.initialize().finally(() => {
      const names = ['fl', 'fr', 'rl', 'rr']
      wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1)

      for (const n of names) {
        const wheel = this.getByName(`wheel_${n}`)
        if (wheel) {
          this.#wheels.push(wheel)
          wheel.matrixAutoUpdate = true
        }
      }
    })
  }

  move(dir = 1, speed = 0) {
    const currentSpeed = Math.min(speed + this.#speed.acc, this.#speed.max)
    const direction = new Vector3(0, 0, dir).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, -currentSpeed)
  }

  update() {
    const [fl, fr] = this.#wheels

    if (this.control.direction.East) {
      if (fl.rotation.z < 0.8) {
        fl.rotateZ(0.01)
        fr.rotateZ(0.01)
        // fl.rotation.z -= 0.01
        // fr.rotation.z -= 0.01
      }
    }

    if (this.control.direction.West) {
      if (fr.rotation.z > -0.8) {
        fl.rotateZ(-0.01)
        fr.rotateZ(-0.01)
        // fl.rotateOnAxis()
        // fl.rotation.z += 0.01
        // fr.rotation.z += 0.01
      }
    }

    if (this.control.direction.North) {
      // this.move(0.1)
      const time = -performance.now() / 1000
      for (const wheel of this.#wheels) {
        wheel.rotateX(time * Math.PI * 2)
        // wheel.rotation.x = (time * Math.PI * 2)
      }
    }
    if (this.control.direction.South) {
      // this.move(-0.1)
      const time = -performance.now() / 1000
      for (const wheel of this.#wheels) {
        wheel.rotateX(-(time * Math.PI * 2))
        // wheel.rotation.x = -(time * Math.PI * 2)
      }
    }
  }

  getByName(name: string) {
    return this.children[0].getObjectByName(name)
  }
}
