document.getElementById("imageUploader").addEventListener("change", async (event) => {
  console.log("Image upload triggered");
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      chrome.storage.local.get(["images"], ({ images }) => {
        const updatedImages = images ? [...images, imageUrl] : [imageUrl];
        chrome.storage.local.set({ images: updatedImages }, () => {
          console.log("Images updated in local storage:", updatedImages);
          updateImageList(updatedImages);
          triggerImagePopup(imageUrl); // アップロード後すぐにポップアップ
        });
      });
    };
    reader.readAsDataURL(file);
  }
});

// メッセージを送信してポップアップ
function triggerImagePopup(imageUrl) {
  console.log("Triggering immediate popup for:", imageUrl);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "popupImage", imageUrl });
    }
  });
}

// 画像リストを更新
function updateImageList(images) {
  const imageList = document.getElementById("imageList");
  imageList.innerHTML = "";
  images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "image-card";
    imageList.appendChild(img);
  });
}

// 初回ロード時にローカルから画像を読み込む
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["images"], ({ images }) => {
    if (images && images.length) {
      console.log("Loaded images from local storage:", images);
      updateImageList(images);
    }
  });
});
