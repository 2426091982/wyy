import type { Scene, Camera } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadingManager } from './useLoadingManager'

export const useCreateGeometry = (scene: Scene, cemera: Camera, control: OrbitControls) => {
  // 导入纹理
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const planeTexture = textureLoader.load('/texture/drive-download-20221006T103431Z-001/Gravel_001_BaseColor.jpg')
  // 粗糙度
  const planeAoTexture = textureLoader.load('/texture/drive-download-20221006T103431Z-001/Gravel_001_AmbientOcclusion.jpg')
  // 层次贴图
  const planeHeightTexture = textureLoader.load('/texture/drive-download-20221006T103431Z-001/Gravel_001_Height.png')
  // 法线贴图
  const planeNormalTexture = textureLoader.load('/texture/drive-download-20221006T103431Z-001/Gravel_001_Normal.jpg')
  // 几何体
  // 法向用来计算光的反射
  // uv 用来计算贴图对应的位置
  const geometry = new THREE.SphereGeometry(1, 100, 100, 1)
  const material = new THREE.MeshStandardMaterial({
    map: planeTexture,
    aoMap: planeAoTexture,
    aoMapIntensity: 0.4,
    roughness: .2,
    displacementMap: planeHeightTexture,
    displacementScale: 0.1,
    fog: true,
    normalMap: planeNormalTexture,
  })
  const sphere = new THREE.Mesh(geometry, material)
  // 被照射是否创建阴影
  sphere.castShadow = true
  sphere.position.set(0, 0, 0)


  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshStandardMaterial()
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.position.set(2, 0, 2)
  box.castShadow = true

  // 平面
  const planeGemtry = new THREE.PlaneGeometry(1000, 1000)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 })
  const plane = new THREE.Mesh(planeGemtry, planeMaterial)
  plane.position.set(0, -1, 0)
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true // 接收阴影

  scene.add(sphere)
  scene.add(plane)
  scene.add(box)
} 