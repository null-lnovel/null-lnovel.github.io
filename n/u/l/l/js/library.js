function reloadImage(img) {
    let baseUrl = "";
    let arr = img?.src?.split("/n/u/l/l/");
    if (arr?.length > 0) {
        baseUrl = arr[arr?.length - 1];
        if (baseUrl?.length > 0) {
            let request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            let arr = ['','2','3','4'];
            for (let index = 0; index < arr?.length; index++) {
                let host = arr[index];
                let checkURl = "https://null-library"+host+".github.io/n/u/l/l/"+baseUrl;
                try {
                    request?.open('GET', checkURl, false);
                    request?.send(); 
                    if (request.status === 200) {
                        let url = new URL(checkURl);
                        url.searchParams.set('reload', 'true');
                        img.src = url.toString();
                        break;
    
                    }
                } catch (error) {          
                    console.log(error);
                    
                } 
                
            }
        }
    }    
    img.onerror = null;

}


// scroll-save.js (throttle 500ms)

(function () {
  const pageKey = "scroll_percent_" + location.pathname;
  const SAVE_DELAY = 1500; // 500ms

  let lastSaveTime = 0;
  let saveTimeout = null;

  function restoreScroll() {
    const saved = localStorage.getItem(pageKey);
    if (!saved) return;

    const percent = parseFloat(saved);
    const height = document.body.scrollHeight - window.innerHeight;

    if (height > 0) {
      window.scrollTo(0, height * percent);
    }
  }

  function saveScroll() {
    const now = Date.now();

    // Nếu chưa đủ 500ms thì đợi
    if (now - lastSaveTime < SAVE_DELAY) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(doSave, SAVE_DELAY);
      return;
    }

    doSave();
  }

  function doSave() {
    const height = document.body.scrollHeight - window.innerHeight;
    if (height <= 0) return;

    const percent = window.scrollY / height;
    localStorage.setItem(pageKey, percent);

    lastSaveTime = Date.now();
  }

  window.addEventListener("load", restoreScroll);
  window.addEventListener("scroll", saveScroll);
})();


// toc-popup.js (H1 + H2)

(function () {
  function initTOC() {
    const headings = document.querySelectorAll(".null-h1, .null-h2");
    if (!headings.length) return;

    headings.forEach((el, index) => {
      if (!el.id) {
        el.id = "toc_heading_" + index;
      }
    });

    // ===== Button =====
    const button = document.createElement("button");
    button.innerText = "☰";
    Object.assign(button.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      padding: "6px 10px",
      borderRadius: "25%",
      border: "none",
      background: "#333",
      color: "#fff",
      fontSize: "14px",
      cursor: "pointer",
	  fontWeight :700

    });
    document.body.appendChild(button);

    // ===== Overlay =====
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "none",
      zIndex: "9998"
    });
    document.body.appendChild(overlay);

    // ===== Popup =====
    const popup = document.createElement("div");
    Object.assign(popup.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
	  width : "75%",
		maxWidth : "450px",
		minWidth : "350px",
      maxHeight: "70%",
      overflowY: "auto",
      background: "#131313",
      padding: "15px",
      borderRadius: "10px",
      zIndex: "9999",
      display: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(popup);

    const title = document.createElement("h3");
    title.innerText = "Table of Contents";    
	title.style.fontSize = "30px";  
	title.style.marginTop = "10px";  
	title.style.marginBottom = "10px";  
	title.style.fontFamily = "NewRocker";  
	title.style.textAlign = "center";
    popup.appendChild(title);

    const list = document.createElement("ul");
    Object.assign(list.style, {
      listStyle: "none",
      padding: 0
    });
    popup.appendChild(list);

    headings.forEach((el) => {
		const text = el.innerText.trim();

	  // ❌ Bỏ qua nếu bắt đầu bằng "To be continue" (không phân biệt hoa thường)
	  if (text.toLowerCase().startsWith("to be continue")) {
		return;
	  }
      const li = document.createElement("li");
      li.innerText = el.innerText.replace(/\.+$/, "");
      li.style.cursor = "pointer";
      li.style.padding = "3px 5px";
	  li.style.fontFamily = "UTM-Androgyne"; 

	  // Nếu là H2 thì thụt lề
	if (el.classList.contains("null-h2")) {

	  li.style.display = "flex";
	  li.style.alignItems = "bottom";
	  li.style.paddingLeft = "30px";
	  li.style.fontSize = "14px";
	  li.style.opacity = "0.8";

	  const textSpan = document.createElement("span");
	  textSpan.innerText = el.innerText.replace(/\.+$/, "");

	  const lineSpan = document.createElement("span");
	  lineSpan.style.flex = "1";
	  lineSpan.style.borderBottom = "2px dotted #999";
	  lineSpan.style.marginLeft = "8px";

	  li.innerText = ""; // xóa text cũ
	  li.appendChild(textSpan);
	  li.appendChild(lineSpan);

	} else {

	  li.style.fontWeight = "bold";
	  li.style.marginTop = "6px";
	  li.style.paddingTop = "5px";
	  li.style.borderTop = "1px solid #ccc";

	}

      li.onclick = function () {
        el.scrollIntoView({ behavior: "smooth" });
        closePopup();
      };

      list.appendChild(li);
    });

    function openPopup() {
      overlay.style.display = "block";
      popup.style.display = "block";
    }

    function closePopup() {
      overlay.style.display = "none";
      popup.style.display = "none";
    }

    button.onclick = openPopup;
    overlay.onclick = closePopup;
  }

  window.addEventListener("load", initTOC);
})();