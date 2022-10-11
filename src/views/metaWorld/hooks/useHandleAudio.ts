import { loadingManager } from './useLoadingManager';

import { store } from "@/store"
import * as THREE from 'three'
import { Camera, Scene } from 'three'
import { Ref, ref } from 'vue';

export let analyser: THREE.AudioAnalyser

export let group = new THREE.Group()

export function useHandleAudio(
  scene: Scene,
  camera: Camera,
  total: Ref<number>,
  process: Ref<number>,
  textureCount: Ref<number>
) {

  let first = true
  let audio = store.state.audio
  let audioLoaded = ref(false)

  if (audio == null) {
    audio = document.createElement('audio')
  }


  let N = 128 //控制音频分析器返回频率数据数量
  for (let i = 0; i < N / 2; i++) {
    let box = new THREE.BoxGeometry(0.01, 1, 0.01) //创建一个立方体几何对象
    let material = new THREE.MeshPhongMaterial({
      color: 'red'
    }); //材质对象
    let mesh = new THREE.Mesh(box, material); //网格模型对象
    mesh.position.set(0.1 * i, 2, 5)
    group.add(mesh)
  }
  scene.add(group)

  const src = `/obj_wo3DlMOGwrbDjj7DisKw_7167775109_ba89_7ae8_7862_12e261e1d1491071eb4242088d29e7e4.mp3`
  audio.src = src
  audio.autoplay = true

  // 初始化一个侦听器
  const audioListener = new THREE.AudioListener()
  // 添加该侦听器到相机中
  camera.add(audioListener)
  // 实例化一个音频（环境音）对象
  const positionalAudio = new THREE.PositionalAudio(audioListener)

  positionalAudio.position.set(0.5, 0.5, 1)
  positionalAudio.setRefDistance(2)

  scene.add(positionalAudio);

  const loader = new THREE.AudioLoader(loadingManager)
  loader.load(src, (audioBuffer) => {
    // 将音频buffer放入实例中
    positionalAudio.setBuffer(audioBuffer)
    positionalAudio.loop = true
    audioLoaded.value = true
    analyser = new THREE.AudioAnalyser(positionalAudio, 2 * N);
  }, ({ loaded, total: t }) => {
    if (first) {
      total.value += t
      first = false
    }
    loaded += textureCount.value
    process.value = +((loaded / total.value) * 100).toFixed(0)
  })
  
  return {
    audioLoaded,
    oceanAmbientSound: positionalAudio
  }
}