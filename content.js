
chrome.storage.sync.get(["images"], ({ images }) => {
  if (images.length) {
    images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "fixed";
      img.style.bottom = "-100px";
      img.style.left = `${Math.random() * 90}vw`;
      img.style.width = "100px";
      img.style.transition = "bottom 2s ease-out";

      document.body.appendChild(img);

      setTimeout(() => {
        img.style.bottom = "0";
        setTimeout(() => img.remove(), 3000);
      }, 100);
    });
  }
});
