chrome.runtime.onInstalled.addListener(() => {
  const defaultImages = [
    chrome.runtime.getURL("rakko.png") // 拡張機能内のデフォルト画像
  ];
  chrome.storage.sync.set({ images: defaultImages });
});
