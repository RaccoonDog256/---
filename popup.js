
document.getElementById("uploadImage").addEventListener("click", () => {
  document.getElementById("imageUploader").click();
});

document.getElementById("imageUploader").addEventListener("change", async (event) => {
  console.log("Image upload triggered");
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      chrome.storage.sync.get(["images"], ({ images }) => {
        const updatedImages = images ? [...images, imageUrl] : [imageUrl];
        chrome.storage.sync.set({ images: updatedImages });
        updateImageList(updatedImages);
      });
    };
    reader.readAsDataURL(file);
  }
});

function updateImageList(images) {
  const imageList = document.getElementById("imageList");
  imageList.innerHTML = "";
  images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "100px";
    imageList.appendChild(img);
  });
}
