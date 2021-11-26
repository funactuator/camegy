setTimeout(() =>{
  const data = ["images", "video"];
  const IMAGE = 0;
  const VIDEO = 1;
  if(db){
    // retrieve data
    // console.log(db);
    retrieveFromDB(data[0]);
    retrieveFromDB(data[1]);

  }
},100)


function retrieveFromDB(type){
  console.log("reached here");
  let dbTransaction = db.transaction(type, "readonly");
  let objStore = dbTransaction.objectStore(type);
  let request = objStore.getAll();
  request.onsuccess = (e) => {
    let objArr = request.result;
    loadMediaObjects(objArr, );
  };
}

function loadMediaObjects(objArr){
  objArr.forEach((obj) => {
    let val = obj.id.slice(0,3);
    // console.log(val);
    let typeVal = val === "img" ? 0:1;
    createMediaFromObj(obj, typeVal);
  })
}

function createMediaFromObj(obj, typeVal){
  // 0 - image 1 - video
  // console.log(obj);
  const galleryContainer = document.querySelector(".gallery-container");
  let mediaContainer;
  let url;
  let contentType = typeVal === 0 ? "image" : "video";
  let objectStore = typeVal === 0 ? "images" : "video";
  let id = obj.id;
  // console.log(obj.id);
  if(typeVal == 0){
    url = obj.url;
    mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container", obj.id);

    mediaContainer.innerHTML = `
    <div class="media">
      <img src="${url}" ></img>
    </div>
    <div class="action-btn-container">
      <div class="download">
        <span class="material-icons">download_for_offline</span>
      </div>
        <div class="delete"><span class="material-icons">delete</span>
      </div>
    </div>
    `;
    galleryContainer.appendChild(mediaContainer);
  }else if(typeVal == 1){
    url = blobToUrl(obj.blob);
    mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container", obj.id);
    mediaContainer.innerHTML = `
    <div class="media">
      <video autoplay loop src="${url}" ></video>
    </div>
    <div class="action-btn-container">
      <div class="download">
        <span class="material-icons">download_for_offline</span>
      </div>
        <div class="delete"><span class="material-icons">delete</span>
      </div>
    </div>
    `;
    galleryContainer.appendChild(mediaContainer);
  }

  let downloadBtn = mediaContainer.querySelector(".download");
  downloadBtn.addEventListener("click", (e) => {
    // apply download feature
    autoDownload(url, contentType);
  });
  let deleteBtn = mediaContainer.querySelector(".delete");
  deleteBtn.addEventListener("click", (e) => {
    // apply delete feature
    deleteFromDB(id, objectStore);
  });

}

function blobToUrl(blob){
  return URL.createObjectURL(blob);
}

function autoDownload(url, type){
  let downloadFileName = '';
  if(type === "image"){
    downloadFileName = 'image.jpeg';
  }else if(type === "video"){
    downloadFileName = 'stream.mp4';
  }
  let anchor = document.createElement("a");
  anchor.href = url
  anchor.download = downloadFileName;
  anchor.click();
}

function deleteFromDB(id, storeName){
  // console.log(storeName);
  // console.log(id);
  let dbTransaction = db.transaction(storeName, "readwrite");
  let request = dbTransaction.objectStore(storeName).delete(id);
  request.onsuccess = (e) => {
    console.log(id);
    let elt = document.querySelector(`.${id}`);
    console.log(elt);
    elt.remove();

  };
}