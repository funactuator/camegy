let db;
const openRequest = indexedDB.open("camegyDB");
openRequest.addEventListener("success", (e) =>{
  console.log("db sucess");
  db = openRequest.result;
});
openRequest.addEventListener("error", (e) => {
  console.log("db error");
});
openRequest.addEventListener("upgradeneeded", (e) =>{
  console.log("db upgraded and loading db initially");
  // Any schema change is handled through upgradeneeded
  // while transactions are done via success 
  // take this information with pinch of salt
  // all object store creation are done through upgradeneeded
  db = openRequest.result
  db.createObjectStore("video", {keyPath:"id"});
  db.createObjectStore("images", {keyPath:"id"});
});