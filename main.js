import * as THREE from "three"
import { FBXLoader } from "./node_modules/three/examples/jsm/loaders/FBXLoader"

const changeToRedBtn = document.getElementById("change-to-red")
const changeToBlueBtn = document.getElementById("change-to-blue")
const changeToGreenBtn = document.getElementById("change-to-green")
const changeTextureBtn = document.getElementById("change-texture")

const mediaUploadContainer = document.querySelector(".media-upload-wrap")
const uploadMediaBtn = document.getElementById("upload-media")
const mediaUploadVideo = document.getElementById("media-upload-video")
const captureMediaBtn = document.getElementById("capture-media")
const closeModalBtn = document.getElementById("close-modal")
const mediaUploadCanvas = document.getElementById("media-upload-canvas")

function changeColorHandlerInit(btn, mesh, colorCode) {
  btn.addEventListener("click", () => {
    console.log(btn.id)
    mesh.material.color.set(colorCode)
  })
}

// Create the scene and a camera to view it
var scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

/*** Camera ***/
// Specify the portion of the scene visiable at any time (in degrees)
var fieldOfView = 50
var aspectRatio = window.innerWidth / window.innerHeight
var nearPlane = 0.1
var farPlane = 1000

// Use the values specified above to create a camera
var camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
)

// Finally, set the camera's position in the z-dimension
camera.position.set(0, 75, -198)

// camera rotation
camera.rotation.set(-179.7, -58.01, 2.5)

/*** Renderer ***/
// Create the canvas with a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true })

// Specify the size of the canvas
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// Add the canvas to the DOM
document.body.appendChild(renderer.domElement)

/*** Render! ***/
// texture loader to load all the textures
const textureLoader = new THREE.TextureLoader()

const modelURL = "/assets/models/room-interior.FBX"

// loader
const modelloader = new FBXLoader()
modelloader.load(
  modelURL,

  // onload function
  (object) => {
    console.log(object)
    scene.add(object)

    let ceiling = null
    const ceilingID = 2440026032

    object.traverse((child) => {
      if (child.isMesh) {
        // Check if mesh has the ID of the mesh you want to color
        if (child.name === "FbxMesh" && child.ID === ceilingID) {
          ceiling = child
        }
      }
    })

    if (ceiling !== null) {
      ceiling.material.needsUpdate = true
      changeColorHandlerInit(changeToRedBtn, ceiling, "red")
      changeColorHandlerInit(changeToGreenBtn, ceiling, "green")
      changeColorHandlerInit(changeToBlueBtn, ceiling, "blue")
      textureLoader.load(
        "./public/assets/models/Textures/painting.png",

        // onload
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture })
          // in this example we create the material when the texture is loaded
          texture.needsUpdate = true

          changeTextureBtn.addEventListener("click", () => {
            ceiling.material = material
          })
        }
      )
    }
  },
  undefined,

  // onError
  (error) => {
    console.error(error)
  }
)

// raycaster instance to add event listener
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseMove(event) {
  // Calculate normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function onClick(event) {
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // Test for intersections with meshes
  const intersects = raycaster.intersectObjects(scene.children, true)

  // Check if any meshes were clicked
  if (intersects.length > 0) {
    console.log("Mesh clicked:", intersects[0].object)
  }
}

// The main animation function that re-renders the scene each animation frame
function animate() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

window.addEventListener("mousemove", onMouseMove)
window.addEventListener("click", onClick)
window.requestAnimationFrame(animate)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
addEventListener("resize", onWindowResize)

// to upload media
uploadMediaBtn.addEventListener("click", async () => {
  mediaUploadContainer.classList.add("open")

  let stream = null

  try {
    /* use the stream */
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    mediaUploadVideo.srcObject = stream
    console.log(stream)
  } catch (err) {
    console.error(err)
  }
})

captureMediaBtn.addEventListener("click", () => {
  mediaUploadCanvas
    .getContext("2d")
    .drawImage(
      mediaUploadVideo,
      0,
      0,
      mediaUploadCanvas.width,
      mediaUploadCanvas.height
    )
  let imageDataUrl = mediaUploadCanvas.toDataURL("image/jpeg")
  console.log(imageDataUrl)
})

closeModalBtn.addEventListener("click", () => {
  video.pause()
  video.srcObject = ""
  mediaUploadContainer.classList.remove("open")
})
