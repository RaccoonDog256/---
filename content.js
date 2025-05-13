// 初回ロード時の画像表示
chrome.storage.sync.get(["images"], ({ images }) => {
  console.log("Content script loaded with images:", images);
  if (images && images.length) {
    startImagePopup(images);
  }
});

// 画像が変更されたときにポップアップ表示
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.images) {
    console.log("Images updated:", changes.images.newValue);
    startImagePopup(changes.images.newValue);
  }
});

// メッセージを受信してポップアップ
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "popupImage") {
    console.log("Immediate popup message received:", message.imageUrl);
    displayImagePopup(message.imageUrl); // メッセージ受信時は即ポップアップ
  }
});

// 画像ポップアップのタイマー管理
let popupInterval;
let storedImages = []; // 画像を保持

// ポップアップ開始関数
function startImagePopup(images) {
  // 既にポップアップ中なら一度クリア
  if (popupInterval) {
    clearInterval(popupInterval);
  }

  storedImages = images; // 画像を保存
  console.log("Stored images for popup:", storedImages);

  // 3秒ごとにポップアップ
  popupInterval = setInterval(() => {
    displayImages(storedImages);
  }, 3000);
}

// 画像をポップアップ表示する関数
function displayImages(images) {
  console.log("Displaying images:", images);
  if (images && images.length) {
    images.forEach((src) => {
      displayImagePopup(src);
    });
  } else {
    console.log("No images to display");
  }
}

// 画像を個別にポップアップ表示（リサイズ）
function displayImagePopup(imageUrl) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.position = "fixed";
  img.style.bottom = "-100px";
  img.style.left = `${Math.random() * 90}vw`;
  img.style.height = "150px"; // 高さを固定
  img.style.width = "auto";   // 幅はアスペクト比に応じて自動
  img.style.transition = "bottom 2s ease-out";

  document.body.appendChild(img);

  setTimeout(() => {
    img.style.bottom = "0";
    setTimeout(() => img.remove(), 3000);
  }, 100);
}
