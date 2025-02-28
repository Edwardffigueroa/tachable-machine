let socket = io("http://localhost:5050", { path: "/real-time" })

socket.on("listener", (message) => {
  console.log(message)
})

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/tx2OWpH7m/"

let model, webcam, labelContainer, maxPredictions

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json"
  const metadataURL = URL + "metadata.json"

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL)
  maxPredictions = model.getTotalClasses()

  // Convenience function to setup a webcam
  const flip = true // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip) // width, height, flip
  await webcam.setup() // request access to the webcam
  await webcam.play()
  window.requestAnimationFrame(loop)

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas)
  labelContainer = document.getElementById("label-container")
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"))
  }
}

async function loop() {
  webcam.update() // update the webcam frame
  await predict()
  window.requestAnimationFrame(loop)
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas)
  const isEdwar = prediction.find((p) => p.className === "Edwar")
  if (isEdwar.probability > 0.8) {
    socket.emit("isEdwar") // Sends a string message to the server
  } else {
    socket.emit("isNotEdwar")
  }
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2)
    labelContainer.childNodes[i].innerHTML = classPrediction
  }
}

init() // call the init function to load the model and start the webcam
