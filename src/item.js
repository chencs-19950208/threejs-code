import * as THREE from 'three'
// 创建相机
const width = window.innerWidth;
const height = 150;
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
const scene = new THREE.Scene(); // 场景实例
const renderer = new THREE.WebGLRenderer({ antialias: true }); // three 渲染实例

renderer.setSize(width, height); 
renderer.setClearColor(0xffffff); 
camera.position.set(-200, 35, 0); // 相机的位置
camera.lookAt(scene.position); // 相机看场景的位置

// const axesHelper = new THREE.AxesHelper( 1000 );
// axesHelper.position.set(0, -120, 0);
// scene.add( axesHelper );

const pointLight = new THREE.DirectionalLight('#fff');
pointLight.position.set(-200, 100, 0); // 光源位置
scene.add(pointLight);

const itemDom = document.getElementById('item');
itemDom.appendChild(renderer.domElement)

// 立方体统一封装函数
function createCube(x, y, z, h, color) {
  // 第一个立方体
  const geometry = new THREE.BoxGeometry(60, h, 105);
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material); // 物体
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  scene.add(cube);
};

function create () {
  createCube(10, -65, 0, 120, '#FF7400');
  createCube(20, -75, -105, 120, '#FCD661');
  createCube(30, -85, 105, 120, '#03CFAE')
};

function render () {
  renderer.render(scene, camera);
  requestAnimationFrame(render)
};

create();
render();
