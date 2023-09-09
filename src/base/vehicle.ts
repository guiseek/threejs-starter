import {Quaternion, Vector3} from 'three'
import {Control} from './control'
import {Model} from './model'

interface VehicleSpeed {
  min: number
  max: number
  now: number
  acc: number
}

interface VehicleRotate {
  quaternion: Quaternion
  angle: number
  yaw: Vector3
}

export abstract class Vehicle extends Model {
  protected abstract control: Control
  protected abstract speed: VehicleSpeed
  protected abstract rotate: VehicleRotate

  protected handleInput() {
    if (this.control.key.A) {
      this.toLeft(this.rotate.angle)
    }

    if (this.control.key.D) {
      this.toRight(this.rotate.angle)
    }

    if (this.control.key.W) {
      this.toDown(this.rotate.angle)
    }

    if (this.control.key.S) {
      this.toUp(this.rotate.angle)
    }
  }

  toUp(angle: number) {
    this.rotateX(-angle * 1.1)
  }

  toDown(angle: number) {
    this.rotateX(angle * 1.1)
  }

  toLeft(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(this.rotate.yaw, angle)
    this.rotate.quaternion.multiply(quaternion)
    this.rotateZ(-angle)
  }

  toRight(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(
      this.rotate.yaw,
      -angle
    )
    this.rotate.quaternion.multiply(quaternion)
    this.rotateZ(angle)
  }

  rotateSmoothly(alpha: number) {
    const quaternion = new Quaternion()
    quaternion.slerpQuaternions(this.quaternion, this.rotate.quaternion, alpha)
    this.quaternion.copy(quaternion)
  }

  toForward(speed = 0) {
    const currentSpeed = Math.min(speed + this.speed.acc, this.speed.max)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, -currentSpeed)
  }

  toBrake(speed = 0) {
    const currentSpeed = Math.max(speed - this.speed.acc, this.speed.min)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, currentSpeed)
  }
}
