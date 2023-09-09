/// <reference types="vite/client" />

declare const container: HTMLElement

interface Callback<T = void> {
  (value: T): void
}
