const videoElt = document.querySelector("video");
const recordBtnContainer = document.querySelector(".record-btn-container");
const recordBtn = document.querySelector(".record-btn");
const captureBtnContainer = document.querySelector(".capture-btn-container");
const captureBtn = document.querySelector(".capture-btn");
const timerELt = document.querySelector(".timer");
const filterLayer = document.querySelector(".filter-layer");
const filters = document.querySelectorAll(".filter");
let filterColor = "transparent";

const constraints = {
  audio:true,
  video:true
};
let chunks = [];
let recorder;
let recordFlag = false;


navigator.mediaDevices.getUserMedia(constraints)
.then((stream) =>{
  videoElt.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) =>{
    chunks = [];
  });
  recorder.addEventListener("dataavailable",(e) => {
    // work when we recieve a chunk of data
    chunks.push(e.data);

  });
  recorder.addEventListener("stop", (e) =>{
    // work when we stop recording
    let blob = new Blob(chunks, {'type':'video/mp4'});
    chunks = [];
    let videoURL = URL.createObjectURL(blob);
    // console.log(videoURL);
    autoDownload(videoURL, "video");
  });
}).catch((err)=>{
  // alert("error in permissions!");
});


recordBtnContainer.addEventListener("click", (e) => {
  if(!recorder){
    return;
  }
  recordFlag = !recordFlag;
  if(recordFlag){
    // start recording
    startTimer();
    recordBtn.classList.add("scale-record");
    recorder.start();

  }else{
    // end recording
    stopTimer();
    recordBtn.classList.remove("scale-record");
    recorder.stop();
  }
});


captureBtnContainer.addEventListener("click", (e) =>{
  const canvas = document.createElement("canvas");
  canvas.height = videoElt.videoHeight;
  canvas.width = videoElt.videoWidth;
  const tool = canvas.getContext('2d');

  tool.drawImage(videoElt, 0, 0, canvas.width, canvas.height);
  tool.fillStyle = filterColor;
  tool.fillRect(0,0,canvas.width, canvas.height);
  let imageURL = canvas.toDataURL('image/jpeg', 1.0);
  autoDownload(imageURL, "image");
})





function startTimer(){
  timerELt.style.display = "block";
  let counter = 0;
  setInterval(() =>{
    counter++;
    let time = convertSecondsToTime(counter);
    timerELt.innerHTML = `${time.hours}:${time.minutes}:${time.seconds}`;
  }, 1000);
};

function stopTimer(){
  timerELt.style.display = "none";
  timerELt.innerHTML = "00:00:00";
}


function convertSecondsToTime(seconds){
  let time = {};
  time.hours = Number.parseInt(seconds/3600);
  seconds = seconds%3600;
  time.minutes = Number.parseInt(seconds/60);
  seconds = seconds%60;
  time.seconds = seconds;

  // convert to suitable format of 00:00:00
  time.hours = time.hours >= 10? time.hours : `0${time.hours}`; 
  time.minutes = time.minutes >= 10? time.minutes : `0${time.minutes}`;
  time.seconds = time.seconds >= 10? time.seconds : `0${time.seconds}`;
  return time;
}

function autoDownload(url, type){
  let downloadFileName = '';
  if(type === "image"){
    downloadFileName = 'image.jpeg';
  }else{
    downloadFileName = 'stream.mp4';
  }
  let anchor = document.createElement("a");
  anchor.href = url
  anchor.download = downloadFileName;
  anchor.click();
}

// handling filters
filters.forEach((filterElt) =>{
  filterElt.addEventListener("click", (e) => {
    //get filter color
    // set filter layer -- for our visibility that filter is being applied, nothing to do with actual filter
    // set color para for canvas to apply 
    // filter in canvas image
    filterColor = getComputedStyle(filterElt).backgroundColor;
    console.log(filterColor);
    filterLayer.style.backgroundColor = filterColor;
  });
});