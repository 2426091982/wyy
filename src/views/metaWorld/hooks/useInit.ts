
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onUnmounted } from "@vue/runtime-core";
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'
import { loadingManager } from './useLoadingManager';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/LensFlare'
import { analyser, group } from './useHandleAudio';


export const useInit = () => {
  const { innerWidth: w, innerHeight: h } = window
  // 场景
  const scene = new THREE.Scene()

  // 辅助工具
  var helper = new THREE.AxesHelper(10);
  scene.add(helper);

  // 相机
  const camera = new THREE.PerspectiveCamera(90, w / h, 0.1, 1000)
  camera.position.set(2, 2, 5)
  scene.add(camera)

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffbb, 1)
  ambientLight.position.set(0, 0, 0)
  scene.add(ambientLight)

  // 创建光晕
  const pointLight = new THREE.PointLight(0xff7700, 1, 200);
  pointLight.position.set(44, 14, 50);
  pointLight.castShadow = true
  scene.add(pointLight);

  // 光晕贴图
  const texture = new THREE.TextureLoader(loadingManager)
  const textureFlare0 = texture.load('/texture/lensflare0.png')
  const textureFlare2 = texture.load('/texture/lensflare2.png')
  const textureFlare3 = texture.load('/texture/lensflare3.png')
  const flareColor = new THREE.Color(0xffffff);
  flareColor.setHSL(0.55, 0.9, 1.0);

  const lensFlare = new Lensflare();
  lensFlare.addElement(new LensflareElement(textureFlare0, 512, 0))
  lensFlare.addElement(new LensflareElement(textureFlare2, 512, 0))
  lensFlare.addElement(new LensflareElement(textureFlare2, 512, 0))
  lensFlare.addElement(new LensflareElement(textureFlare2, 512, 0))
  lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6))
  lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7))
  lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9))
  lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1))
  lensFlare.position.copy(pointLight.position)
  scene.add(lensFlare);


  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
    alpha: true, // 光晕等高级特效
  })
  const container = renderer.domElement
  container.id = 'three'
  document.querySelector('#app')!.appendChild(container)
  renderer.setSize(w, h)
  renderer.setPixelRatio(renderer.getPixelRatio())
  renderer.render(scene, camera)
  renderer.shadowMap.enabled = true // 渲染阴影贴图
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const control = new OrbitControls(camera, container)
  control.enableDamping = true // 阻尼效果
  control.maxPolarAngle = Math.PI / 2
  control.maxDistance = 5
  control.minDistance = 3
  control.screenSpacePanning = true
  
  control.position0.set(10, 10, 15)

  // 创建天空
  const sky = new Sky()
  sky.scale.setScalar(450000);
  scene.add(sky);

  // 天空参数
  const effectController = {
    turbidity: 0, // 朦胧感
    rayleigh: 3, // 锐度
    mieCoefficient: 0.1, // 系数
    mieDirectionalG: 0.7, // 
    elevation: 10, // 太阳高度
    azimuth: 40, // 太阳角度
    exposure: renderer.toneMappingExposure // 曝光度
  };
  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = effectController.turbidity;
  uniforms['rayleigh'].value = effectController.rayleigh;
  uniforms['mieCoefficient'].value = effectController.mieCoefficient;
  uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  // 创建太阳
  const sun = new THREE.Vector3();
  sun.setFromSphericalCoords(90, phi, theta);
  uniforms['sunPosition'].value.copy(sun);
  renderer.toneMappingExposure = effectController.exposure;
  renderer.render(scene, camera);

  // 更新函数
  function animate() {
    requestAnimationFrame(animate)
    control.update()
    renderer.render(scene, camera)

    // 渲染音乐的频率
    if (analyser) {
      // 获得频率数据N个
      var arr = analyser.getFrequencyData();
      // 遍历组对象，每个网格子对象设置一个对应的频率数据
      group.children.forEach((elem, index) => {
        elem.scale.y = arr[index] / 80
          ; (elem as any).material.color.r = arr[index] / 200;
      });
    }

  }
  animate()

  // 监听页面变化重新设置渲染器和摄影机的参数
  window.addEventListener('resize', () => {
    const { innerWidth: w, innerHeight: h } = window
    camera.aspect = w / h
    camera.updateProjectionMatrix() // 更新参数，不调用没有效果
    renderer.setPixelRatio(renderer.getPixelRatio())
    renderer.setSize(w, h)
  })

  // 启用/关闭 全屏
  const handleFullscreen = () => {
    const isFullscreen = document.fullscreenElement
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }
  renderer.domElement.addEventListener('dblclick', handleFullscreen)

  onUnmounted(() => {
    control.dispose()
    document.body.removeChild(renderer.domElement)
  })

  return {
    scene,
    camera,
    renderer,
    control
  }
}