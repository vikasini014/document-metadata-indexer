const API = "http://localhost:5000";

async function uploadFile() {

const fileInput =
document.getElementById("fileInput");

if(fileInput.files.length===0){
alert("Select a file");
return;
}

const formData = new FormData();

formData.append(
"document",
fileInput.files[0]
);

await fetch(`${API}/upload`,{
method:"POST",
body:formData
});

fileInput.value="";

loadFiles();
}

async function loadFiles(){

const response =
await fetch(`${API}/files`);

const files =
await response.json();

const cards =
document.getElementById("cards");

cards.innerHTML="";

files.forEach(file=>{

cards.innerHTML += `
<div class="card">

<h3>${file.filename}</h3>

<p><b>Size:</b> ${file.filesize} KB</p>

<p><b>Extension:</b> ${file.extension}</p>

<p><b>Uploaded:</b> ${file.uploadDate}</p>

<button
class="delete-btn"
onclick="deleteFile(${file.id})">
Delete
</button>

</div>
`;
});
}

async function deleteFile(id){

await fetch(`${API}/files/${id}`,{
method:"DELETE"
});

loadFiles();
}

loadFiles();