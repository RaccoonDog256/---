// 初回ロード時の画像表示（ローカルストレージ）
chrome.storage.local.get(["images"], ({ images }) => {
  if (images && images.length) {
    startImagePopup(images);
  }
});

// 画像が変更されたときにポップアップ表示
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.images) {
    console.log("Images updated:", changes.images.newValue);
    startImagePopup(changes.images.newValue);
  }
});

// メッセージを受信してポップアップ
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "popupImage") {
    console.log("Immediate popup message received:", message.imageUrl);
    displayImagePopup(message.imageUrl);
  }
});

// 画像ポップアップのタイマー管理
let popupInterval;
let storedImages = [];

// ポップアップ開始関数
function startImagePopup(images) {
  if (popupInterval) {
    clearInterval(popupInterval);
  }

  storedImages = images;

  // 3秒ごとにポップアップ
  popupInterval = setInterval(() => {
    displayImages(storedImages);
  }, 3000);
}

// 画像をポップアップ表示する関数
function displayImages(images) {
  if (images && images.length) {
    images.forEach((src) => {
      displayImagePopup(src);
    });
  } else {
    console.log("No images to display");
  }
}

// 画像を個別にポップアップ表示
function displayImagePopup(imageUrl) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.position = "fixed";
  img.style.bottom = "-100px";
  img.style.left = `${Math.random() * 90}vw`;
  img.style.height = "150px";
  img.style.width = "auto";
  img.style.transition = "bottom 2s ease-out";

  // ランダムに反転（50%の確率）
  if (Math.random() > 0.5) {
    img.style.transform = "scaleX(-1)";
  }

  document.body.appendChild(img);

  setTimeout(() => {
    img.style.bottom = "0";
    setTimeout(() => img.remove(), 3000);
  }, 100);
}
