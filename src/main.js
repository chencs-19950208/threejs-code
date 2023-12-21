/**
 * threeJS 代码实现
 * @PerspectiveCamera 透视相机，近大远小效果
 *    @
 * @MeshPhongMaterial 反光材质 
 * @MeshBasicMaterial 不会反光
 * 
 * @PointLight 一个光源，多个物体光源显示不一样
 * @DirectionalLight 每个物体光源都是一样的
 * 
 * ThreeJS 相关概念
 * @Scene 场景
 * @Mesh 物体
 * @Geometry 几何体
 * @Material 材质
 * @Camera 摄像机
 * @Light 灯光
 * @Renderer 渲染器

 * 物体存在锯齿，解决
 * WebGLRenderer 中设置 antialias: true
 */

import * as THREE from 'three'

/* ---- 相机移动的全局参数 start ---- */
const targetCameraPos = { x: 100, y: 100, z: 100 };
const cameraFoucs = { x: 0, y: 0, z: 0 };
const targetCameraFoucs = { x: 0, y: 0, z: 0 };
/* ---- 相机移动的全局参数 end ---- */

/* ---- 玩家上跳全局参数 start ---- */
const playerPos = { x: 0, y: 17.5, z: 0 };
const targetPlayPos = { x: 0, y: 17.5, z: 0 };
let player;
let speed = 0; // 上跳的速度
/* ---- 玩家上跳全局参数 end ---- */

/* ---- 立体几何体全局参数 start ---- */
const currentCubePos = { x: 0, y: 0, z: 0 }; // 几何体位置 向右就改变 z 的位置，否则改变 x 的位置。
let direction = 'right'; // 几何体出现的方向
/* ---- 立体几何体全局参数 end ---- */

/* ---- 创建相机 start ----*/
const width = window.innerWidth; // 视口宽度
const height = window.innerHeight; // 视口高度
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000); // 相机实例
/* ---- 创建相机 end ----*/

/* ---- 跳动事件全局参数 start ---- */
let pressed = false;
let speedY = 0; 
let stopped = true; // 标识是否在跳动
/* ---- 跳动事件全局参数 end ---- */

let score = -1; // 得分

const scene = new THREE.Scene(); // 场景实例
const renderer = new THREE.WebGLRenderer({ antialias: true }); // three 渲染实例

renderer.setSize(width, height); 
renderer.setClearColor(0x333333); 
camera.position.set(100, 100, 100); // 相机的位置
camera.lookAt(scene.position); // 相机看场景的位置

const pointLight = new THREE.DirectionalLight(0xffffff);
pointLight.position.set(40, 100, 60); // 光源位置
scene.add(pointLight);

document.body.appendChild(renderer.domElement);

// 加坐标轴
// const axesHelper = new THREE.AxesHelper(1000);
// axesHelper.position.set(0, 0, 0);
// scene.add(axesHelper);

// 立方体统一封装函数
function createCube(x, z) {
  // 第一个立方体
  const geometry = new THREE.BoxGeometry(30, 20, 30);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material); // 物体
  cube.position.x = x;
  cube.position.z = z;
  scene.add(cube);
};

// create 统一处理
function create () {
  createCube(0, 0);

  // 创建移动的方块（玩家）
  function createPlayer() {
    const geometry = new THREE.BoxGeometry(5, 20, 5);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const player = new THREE.Mesh(geometry, material);

    player.position.x = 0;
    player.position.y = 17.5;
    player.position.z = 0;

    scene.add(player);
    return player;
  };

  // 创建移动的方块
  player = createPlayer();

  // 蓄力
  document.body.addEventListener('mousedown', () => {
    pressed = true;
    speed = 0;
    speedY = 0;
  })

  // 释放
  document.body.addEventListener('mouseup', () => {
    pressed = false;
    console.log(speed, 'speed --- ');
  })
};

// 蓄力跳动，缩短动效
function speedUp() {
  if(pressed) {
    speed += 0.1;
    speedY += 0.1;

    if(player.scale.y > 0) {
      player.scale.y -= 0.001;
    } 
    player.position.y -= 15 - 15 * player.scale.y;

    if(player.position.y < 10) {
      player.position.y = 10;
    };
  } else {
    player.scale.y = 1;
  }
};

// 计算玩家是否在下一个平台的有效范围内，player.position 跟currentCubePos + - 15 对比， 用来判断是否成功，计算得分
function playerInCube() {
  if (direction === 'right') {
    if (
      player.position.z < currentCubePos.z + 15 &&
      player.position.z > currentCubePos.z - 15 
    ) {
      return true;
    }
  } else {
    if(
      player.position.x < currentCubePos.x + 15 &&
      player.position.x > currentCubePos.x - 15
    ) {
      return true;
    }
  }

  return false;
};

// 随机距离，创建几何体
function randomCreateCube() {
  // 随机距离，距离在 50 ~ 150 之间
  const distance = Math.floor(50 + Math.random() * 100);
  const num = Math.random();

  if (num > 0.5) {
    currentCubePos.z -= distance;
    direction = 'right';
  } else {
    currentCubePos.x -= distance;
    direction = 'left';
  }

  createCube(currentCubePos.x, currentCubePos.z);
};

// 方块移动的方法（玩家移动），移动完之后在生成下一个方块，距离随机(50 - 150)
function movePlayer () {
  player.position.y += speedY;
  
  if(player.position.y < 17.5) {
    player.position.y = 17.5;

    if(!stopped) {
      if (playerInCube()) {
        score++;
        console.log(score, 'score -- ');
        document.getElementById('score').innerHTML = score;
        randomCreateCube(); // 随机距离，创建下一个平台
      } else {
        console.log('失败, 当前分数：' + score);
        document.getElementById('fail').style.display = 'block';
        document.getElementById('score2').innerHTML = score;
      }
    }

    stopped = true;
  } else {
    stopped = false;
    if(direction === 'right') {
      player.position.z -= speed;
    } else {
      player.position.x -= speed;
    }
  }

  speedY -= 0.3;
};

// 移动相机位置
function moveCamera() {
  if(player.position.y > 17.5) {
    if(direction === 'right') {
      camera.position.z -= speed;
      cameraFoucs.z -= speed;
    } else {
      camera.position.x -= speed;
      cameraFoucs.x -= speed;
    }

    camera.lookAt(cameraFoucs.x, cameraFoucs.y, cameraFoucs.z);
  }
};

function render() {
  if(!pressed) {
    moveCamera();
    movePlayer();
  }
  speedUp();

  renderer.render(scene, camera); // 渲染场景跟相机
  requestAnimationFrame(render); // 浏览器API一帧帧渲染
};

create();
render();

