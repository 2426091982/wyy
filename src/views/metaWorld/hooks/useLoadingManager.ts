import * as THREE from "three";
import type { LoadingManager } from "three";
import { Ref, ref } from "vue";

export let loadingManager = new THREE.LoadingManager()

export const useLoadingManager = (total: Ref<number>) => {
  let first = true
  const loaded = ref(false)
  const process = ref(0)
  const textureCount = ref(0)
  const isError = ref(false)

  const onLoad = () => {
    loaded.value = true
  }

  const onProgress: LoadingManager["onProgress"] = (_url, loaded, t) => {
    if (first) {
      total.value += t
      textureCount.value = t
      first = false
    }
    if (t - total.value -1 > 1) {
      process.value = +((loaded / total.value) * 100).toFixed(0)
    }
  }

  const onError = () => {
    isError.value = true
  }

  loadingManager.onLoad = onLoad
  loadingManager.onProgress = onProgress
  loadingManager.onError = onError

  return {
    textureCount,
    loaded,
    process,
    isError
  }
}
