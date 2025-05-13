document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["images"], ({ images }) => {
    if (images && images.length) {
      console.log("Loaded images from local storage:", images);
      updateImageList(images);
    } else {
      // 初期画像がない場合は追加
      const defaultImages = [chrome.runtime.getURL("rakko.png")];
      chrome.storage.local.set({ images: defaultImages }, () => {
        console.log("Default images set:", defaultImages);
        updateImageList(defaultImages);
      });
    }
  });
});

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
          triggerImagePopup(imageUrl);
        });
      });
    };
    reader.readAsDataURL(file);
  }
});

// 画像リストを更新（削除ボタン付き）
function updateImageList(images) {
  const imageList = document.getElementById("imageList");
  imageList.innerHTML = "";
  images.forEach((src, index) => {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card relative";

    const img = document.createElement("img");
    img.src = src;
    img.className = "w-full rounded";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerText = "×";
    deleteButton.onclick = () => deleteImage(index);

    imageCard.appendChild(img);
    imageCard.appendChild(deleteButton);
    imageList.appendChild(imageCard);
  });
}

// 画像削除関数
function deleteImage(index) {
  chrome.storage.local.get(["images"], ({ images }) => {
    if (images) {
      images.splice(index, 1);
      chrome.storage.local.set({ images: images }, () => {
        console.log("Image deleted. Updated images:", images);
        updateImageList(images);
      });
    }
  });
}

// メッセージを送信してポップアップ
function triggerImagePopup(imageUrl) {
  console.log("Triggering immediate popup for:", imageUrl);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "popupImage", imageUrl });
    }
  });
}
