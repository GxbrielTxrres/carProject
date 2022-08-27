import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// variables
const scene = new THREE.Scene();
let [fov, sz, near, far] = [
  80,
  window.innerWidth / window.innerHeight,
  1,
  1000,
];

// scene
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(fov, sz, near, far);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(20, 10, 0);
// light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// light 2
const dl = new THREE.DirectionalLight(0xffffff, 2);
dl.position.set(1, 10, 5);
scene.add(dl);

//clock
const clock = new THREE.Clock();

// //axis helper
// const axesHelper = new THREE.AxesHelper(12);
// scene.add(axesHelper);

//initialize cannon
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

//ground body with static plane
const groundBody = new CANNON.Body({
  //infinite geometric plane
  shape: new CANNON.Plane(),
});

//wall 1
const wallBody = new CANNON.Body({
  type: (CANNON.Body.STATIC = 2),
  shape: new CANNON.Plane(),
  position: new CANNON.Vec3(0, 0, 50),
});
wallBody.quaternion.setFromEuler(-Math.PI / 1, 0, 0);
physicsWorld.addBody(wallBody);

//wall 2
const wallBody2 = new CANNON.Body({
  type: (CANNON.Body.STATIC = 2),
  shape: new CANNON.Plane(),
  position: new CANNON.Vec3(0, 0, -50),
});
physicsWorld.addBody(wallBody2);

//wall 3
const wallBody3 = new CANNON.Body({
  type: (CANNON.Body.STATIC = 1),
  shape: new CANNON.Plane(),
  position: new CANNON.Vec3(-50, 0, 0),
});
wallBody3.quaternion.setFromEuler(0, Math.PI / 2, 0);
physicsWorld.addBody(wallBody3);

//wall 4
const wallBody4 = new CANNON.Body({
  type: (CANNON.Body.STATIC = 2),
  shape: new CANNON.Plane(),
  position: new CANNON.Vec3(50, 0, 0),
});
wallBody4.quaternion.setFromEuler(0, -Math.PI / 2, 0);
physicsWorld.addBody(wallBody4);

//rotate body by 90 degrees
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

//car
const carBody = new CANNON.Body({
  mass: 5,
  position: new CANNON.Vec3(0, 1, 0),
  shape: new CANNON.Box(new CANNON.Vec3(8, 0.5, 2)),
});

const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });
//add wheels
const mass = 1;
const axisWidth = 5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material("wheel");
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({
  mass,
  material: wheelMaterial,
});
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3(-2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

//wheel 2
const wheelBody2 = new CANNON.Body({
  mass,
  material: wheelMaterial,
});
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

//wheel 3
const wheelBody3 = new CANNON.Body({
  mass,
  material: wheelMaterial,
});
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

//wheel 4
const wheelBody4 = new CANNON.Body({
  mass,
  material: wheelMaterial,
});
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

vehicle.addToWorld(physicsWorld);

//cube
const boxBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(7, 1, 7)),
});
boxBody.position.set(-40, 1, -40);
physicsWorld.addBody(boxBody);

//cube 2
const boxBody2 = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(7, 3, 7)),
});
boxBody2.position.set(-40, 3, 40);
physicsWorld.addBody(boxBody2);

//cube 3
const boxBody3 = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(7, 3, 7)),
});
boxBody3.position.set(40, 3, -40);
physicsWorld.addBody(boxBody3);

//cube 3
const boxBody4 = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(7, 3, 7)),
});
boxBody4.position.set(40, 3, 40);
physicsWorld.addBody(boxBody4);

//cannon js animations
function update() {
  renderer.render(scene, camera);
  physicsWorld.fixedStep();
  window.requestAnimationFrame(update);
}
update();

//wireframe physics world
const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
  color: 0xff0000,
});

//visual ground body
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshMatcapMaterial();
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

//wall 1
const wallGeometry2 = new THREE.PlaneGeometry(100, 100);
const wallMaterial2 = new THREE.MeshNormalMaterial();
const wallMesh2 = new THREE.Mesh(wallGeometry2, wallMaterial2);
const wallMesh3 = new THREE.Mesh(wallGeometry2, wallMaterial2);
const wallMesh4 = new THREE.Mesh(wallGeometry2, wallMaterial2);
const wallMesh5 = new THREE.Mesh(wallGeometry2, wallMaterial2);
scene.add(wallMesh2, wallMesh3, wallMesh4, wallMesh5);
//visual car

//body
const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);
boxMesh.add(camera);
//wheel1
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphereMesh3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphereMesh4 = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh, sphereMesh2, sphereMesh3, sphereMesh4);

const boxGeometry2 = new THREE.BoxGeometry(14, 3, 14);
const boxMesh2 = new THREE.Mesh(boxGeometry2, boxMaterial);
const boxMesh3 = new THREE.Mesh(boxGeometry2, boxMaterial);
const boxMesh4 = new THREE.Mesh(boxGeometry2, boxMaterial);
const boxMesh5 = new THREE.Mesh(boxGeometry2, boxMaterial);
scene.add(boxMesh2, boxMesh3, boxMesh4, boxMesh5);
//three js animations
const animate = () => {
  physicsWorld.fixedStep();
  // cannonDebugger.update();
  boxMesh2.position.copy(boxBody.position);
  boxMesh2.quaternion.copy(boxBody.quaternion);
  boxMesh3.position.copy(boxBody2.position);
  boxMesh3.quaternion.copy(boxBody2.quaternion);
  boxMesh4.position.copy(boxBody3.position);
  boxMesh4.quaternion.copy(boxBody3.quaternion);
  boxMesh5.position.copy(boxBody4.position);
  boxMesh5.quaternion.copy(boxBody4.quaternion);
  sphereMesh.position.copy(wheelBody1.position);
  sphereMesh.quaternion.copy(wheelBody1.quaternion);
  sphereMesh2.position.copy(wheelBody2.position);
  sphereMesh2.quaternion.copy(wheelBody2.quaternion);
  sphereMesh3.position.copy(wheelBody3.position);
  sphereMesh3.quaternion.copy(wheelBody3.quaternion);
  sphereMesh4.position.copy(wheelBody4.position);
  sphereMesh4.quaternion.copy(wheelBody4.quaternion);
  boxMesh.quaternion.copy(carBody.quaternion);
  boxMesh.position.copy(carBody.position);
  planeMesh.quaternion.copy(groundBody.quaternion);
  planeMesh.position.copy(groundBody.position);
  wallMesh2.quaternion.copy(wallBody.quaternion);
  wallMesh2.position.copy(wallBody.position);
  wallMesh3.position.copy(wallBody2.position);
  wallMesh4.position.copy(wallBody3.position);
  wallMesh4.quaternion.copy(wallBody3.quaternion);
  wallMesh5.position.copy(wallBody4.position);
  wallMesh5.quaternion.copy(wallBody4.quaternion);
  window.requestAnimationFrame(animate);
};
animate();

// 3d object
const loader = new GLTFLoader();

loader.load("/textures/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  const model = gltf.scene;
  model.position.set(0, 5, 0);
  model.rotation.y = 1.5;
  model.scale.set(0.05, 0.05, 0.05);
  boxMesh2.add(gltf.scene);

  function animate() {
    model.rotation.y += 0.01;
    requestAnimationFrame(animate);
  }
  animate();
});

loader.load("/threed/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  const model = gltf.scene;
  model.position.set(0, -1, 0);
  model.rotation.y = 4.7;
  model.scale.set(0.04, 0.04, 0.04);
  boxMesh.add(gltf.scene);
});

loader.load("/threed2/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  const model = gltf.scene;
  model.position.set(0, 2, 0);
  model.scale.set(0.015, 0.015, 0.015);
  boxMesh3.add(gltf.scene);
  boxMesh3.add(light);
  function animate() {
    model.rotation.y += 0.005;
    requestAnimationFrame(animate);
  }
  animate();
});

loader.load("/threed3/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  const model = gltf.scene;
  model.position.set(0, 2, 0);
  model.scale.set(0.1, 0.1, 0.1);
  boxMesh4.add(gltf.scene);

  function animate() {
    model.rotation.y += 0.005;
    requestAnimationFrame(animate);
  }
  animate();
});

loader.load("/threed4/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  const model = gltf.scene;
  model.position.set(0, 2, 0);
  model.scale.set(8, 8, 8);
  boxMesh5.add(gltf.scene);

  function animate() {
    model.rotation.y += 0.005;
    requestAnimationFrame(animate);
  }
  animate();
});

const pt = new THREE.Vector3(0, 0, 0);
camera.lookAt(pt);

document.addEventListener("keydown", (event) => {
  const maxSteerVal = Math.PI / 12;
  const maxForce = 50;

  switch (event.key) {
    case "w":
    case "arrowup":
      vehicle.setWheelForce(maxForce, 0);
      vehicle.setWheelForce(maxForce, 1);
      break;

    case "s":
    case "arrowdown":
      vehicle.setWheelForce(-maxForce, 0);
      vehicle.setWheelForce(-maxForce / 2, 1);
      break;

    case "a":
    case "arrowleft":
      vehicle.setSteeringValue(maxSteerVal, 0);
      vehicle.setSteeringValue(maxSteerVal, 1);
      break;

    case "d":
    case "arrowright":
      vehicle.setSteeringValue(-maxSteerVal, 0);
      vehicle.setSteeringValue(-maxSteerVal, 1);
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
    case "arrowup":
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case "s":
    case "arrowdown":
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case "a":
    case "arrowleft":
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;

    case "d":
    case "arrowright":
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;
  }
});
