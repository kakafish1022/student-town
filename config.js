// 全站共用設定檔：只要在這裡貼上你的 Google Apps Script 網址即可
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzzAYrRCU8RNzqKA5i5Z9i5KEngeswK4sAN3HKKALkTF4A-IVl-bRQVrfhkSGfKDEDgdA/exec"; 

// 讀取目前登入的玩家資料
function getPlayerSession() {
  const raw = sessionStorage.getItem('math_town_player');
  if (!raw) return null;
  return JSON.parse(raw);
}

function savePlayerSession(playerObj) {
  sessionStorage.setItem('math_town_player', JSON.stringify(playerObj));
}

// 共用熱區座標定位器
function initHotspotLayer(imgId, layerId, hotspotsArray, onClickCallback) {
  const imgEl = document.getElementById(imgId);
  const layer = document.getElementById(layerId);

  function render() {
    const rect = imgEl.getBoundingClientRect();
    const natRatio = (imgEl.naturalWidth || 16) / (imgEl.naturalHeight || 9);
    const boxRatio = rect.width / rect.height;
    let renderW, renderH, offsetX = 0, offsetY = 0;

    if (boxRatio > natRatio) {
      renderH = rect.height;
      renderW = renderH * natRatio;
      offsetX = (rect.width - renderW) / 2;
    } else {
      renderW = rect.width;
      renderH = renderW / natRatio;
      offsetY = (rect.height - renderH) / 2;
    }

    layer.style.left = (rect.left + offsetX) + 'px';
    layer.style.top = (rect.top + offsetY) + 'px';
    layer.style.width = renderW + 'px';
    layer.style.height = renderH + 'px';
    layer.innerHTML = '';

    hotspotsArray.forEach(item => {
      const el = document.createElement('div');
      el.className = 'hotspot';
      el.style.left = item.left + '%';
      el.style.top = item.top + '%';
      el.style.width = item.width + '%';
      el.style.height = item.height + '%';
      el.innerHTML = `<div class="hotspot-label">${item.name}</div>`;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onClickCallback(item);
      });

      layer.appendChild(el);
    });
  }

  window.addEventListener('resize', render);
  imgEl.addEventListener('load', render);
  if (imgEl.complete) render();
  return render;
}