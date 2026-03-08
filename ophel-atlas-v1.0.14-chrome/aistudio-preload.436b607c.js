var e,t;"function"==typeof(e=globalThis.define)&&(t=e,e=null),function(t,r,o,n,l){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[n]&&i[n],s=a.cache||{},c="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(e,r){if(!s[e]){if(!t[e]){var o="function"==typeof i[n]&&i[n];if(!r&&o)return o(e,!0);if(a)return a(e,!0);if(c&&"string"==typeof e)return c(e);var l=Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}p.resolve=function(r){var o=t[e][1][r];return null!=o?o:r},p.cache={};var d=s[e]=new u.Module(e);t[e][0].call(d.exports,p,d,d.exports,this)}return s[e].exports;function p(e){var t=p.resolve(e);return!1===t?{}:u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=t,u.cache=s,u.parent=a,u.register=function(e,r){t[e]=[function(e,t){t.exports=r},{}]},Object.defineProperty(u,"root",{get:function(){return i[n]}}),i[n]=u;for(var d=0;d<r.length;d++)u(r[d]);if(o){var p=u(o);"object"==typeof exports&&"undefined"!=typeof module?module.exports=p:"function"==typeof e&&e.amd?e(function(){return p}):l&&(this[l]=p)}}({d2v7F:[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"config",()=>l);var n=e("~constants/scripts");let l={matches:["https://aistudio.google.com/*"],run_at:"document_start"};(async()=>{try{let e=await chrome.storage.local.get("settings"),t=e.settings;if("string"==typeof t)try{t=JSON.parse(t)}catch(e){console.error("[Ophel] Failed to parse settings:",e);return}let r=t?.state?.settings?.aistudio||t?.aistudio;if(!r)return;if(r.removeWatermark){let e=document.createElement("script");e.textContent=n.WATERMARK_BLOCKER_CODE;try{(document.head||document.documentElement).appendChild(e),e.remove(),console.warn("[Ophel] Watermark blocker injected")}catch(e){console.error("[Ophel] Failed to inject watermark blocker:",e)}}let o=localStorage.getItem("aiStudioUserPreference")||"{}",l=JSON.parse(o),i=!1;if(void 0!==r.collapseNavbar){let e=!r.collapseNavbar;l.isNavbarExpanded!==e&&(l.isNavbarExpanded=e,i=!0)}if(void 0!==r.collapseTools){let e=!r.collapseTools;l.areToolsOpen!==e&&(l.areToolsOpen=e,i=!0)}if(void 0!==r.collapseAdvanced){let e=!r.collapseAdvanced;l.isAdvancedOpen!==e&&(l.isAdvancedOpen=e,i=!0)}if(void 0!==r.enableSearch&&l.enableSearchAsATool!==r.enableSearch&&(l.enableSearchAsATool=r.enableSearch,i=!0),r.defaultModel&&""!==r.defaultModel.trim()){let e=r.defaultModel.trim();l.promptModel!==e&&(l.promptModel=e,l._promptModelOverride=e,i=!0)}i&&localStorage.setItem("aiStudioUserPreference",JSON.stringify(l));let a=t?.state?.settings?.modelLock||t?.modelLock,s=a&&a["ai-studio"]&&a["ai-studio"].enabled;r.collapseRunSettings&&!s&&function(e){let t=!1,r=null,o=null;function n(){if(t)return;let r=document.querySelector(e);r&&document.body.contains(r)&&null!==r.offsetParent&&!r.disabled&&(o&&clearTimeout(o),o=window.setTimeout(()=>{if(r&&document.body.contains(r)&&null!==r.offsetParent&&!r.disabled)try{let e=new MouseEvent("click",{bubbles:!0,cancelable:!0});r.dispatchEvent(e),t=!0,console.warn("[Ophel] Run settings panel closed"),l()}catch(e){console.error("[Ophel] Failed to click button:",e)}},600))}function l(){r&&(r.disconnect(),r=null),o&&(clearTimeout(o),o=null)}function i(){if(!document.body){requestAnimationFrame(i);return}n(),(r=new MutationObserver(()=>{t||n()})).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["disabled","class","style"]}),setTimeout(()=>{t||l()},3e4)}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",i):i(),window.addEventListener("unload",l)}('button[aria-label="Close run settings panel"]')}catch(e){console.error("[Ophel] AI Studio preload error:",e)}})()},{"~constants/scripts":"4hYRb","@parcel/transformer-js/src/esmodule-helpers.js":"cHUbl"}],"4hYRb":[function(e,t,r){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"WATERMARK_BLOCKER_CODE",()=>n);let n=`
;(function () {
  "use strict"

  const pattern = /watermark_v4\\.png/i
  const logPrefix = "[Ophel Watermark Blocker]"
  const log = (...args) => console.log(logPrefix, ...args)

  const shouldBlock = (candidate) => {
    if (!candidate) return false
    const value = String(candidate)
    if (pattern.test(value)) return true
    try {
      const absolute = new URL(value, location.href).href
      return pattern.test(absolute)
    } catch {
      return false
    }
  }

  // fetch()
  if (window.fetch) {
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      const input = args[0]
      const url = typeof input === "string" ? input : input?.url
      if (shouldBlock(url)) {
        log("Blocked fetch:", url)
        return Promise.reject(new DOMException("Blocked watermark request", "AbortError"))
      }
      return originalFetch.apply(this, args)
    }
  }

  // XMLHttpRequest
  const xhrProto = XMLHttpRequest.prototype
  const originalOpen = xhrProto.open
  const originalSend = xhrProto.send

  xhrProto.open = function (method, url, ...rest) {
    this.__watermarkBlocked = shouldBlock(url)
    if (this.__watermarkBlocked) {
      log("Blocked XHR:", url)
    }
    return originalOpen.call(this, method, url, ...rest)
  }

  xhrProto.send = function (...args) {
    if (this.__watermarkBlocked) {
      this.abort()
      return
    }
    return originalSend.apply(this, args)
  }

  // <img src="...">
  const imageProto = HTMLImageElement.prototype
  const srcDescriptor = Object.getOwnPropertyDescriptor(imageProto, "src")
  if (srcDescriptor?.set && srcDescriptor?.get) {
    Object.defineProperty(imageProto, "src", {
      configurable: true,
      enumerable: srcDescriptor.enumerable,
      get() {
        return srcDescriptor.get.call(this)
      },
      set(value) {
        if (shouldBlock(value)) {
          log("Blocked <img> src:", value)
          return
        }
        return srcDescriptor.set.call(this, value)
      },
    })
  }

  const originalSetAttribute = Element.prototype.setAttribute
  Element.prototype.setAttribute = function (name, value) {
    const lower = String(name).toLowerCase()
    const strValue = String(value)

    if (lower === "src" && shouldBlock(strValue)) {
      log("Blocked setAttribute src:", strValue)
      return
    }

    if (lower === "style" && shouldBlock(strValue)) {
      log("Sanitized inline style:", strValue)
      const sanitized = strValue.replace(pattern, "none")
      return originalSetAttribute.call(this, name, sanitized)
    }

    return originalSetAttribute.call(this, name, value)
  }

  const styleProto = CSSStyleDeclaration.prototype
  const originalSetProperty = styleProto.setProperty
  styleProto.setProperty = function (property, value, priority) {
    if (/background-image/i.test(property) && shouldBlock(value)) {
      log("Blocked background-image via setProperty:", value)
      return
    }
    return originalSetProperty.call(this, property, value, priority)
  }

  const bgDescriptor = Object.getOwnPropertyDescriptor(styleProto, "backgroundImage")
  if (bgDescriptor?.set && bgDescriptor?.get) {
    Object.defineProperty(styleProto, "backgroundImage", {
      configurable: true,
      enumerable: bgDescriptor.enumerable,
      get() {
        return bgDescriptor.get.call(this)
      },
      set(value) {
        if (shouldBlock(value)) {
          log("Blocked backgroundImage setter:", value)
          return
        }
        return bgDescriptor.set.call(this, value)
      },
    })
  }

})()
`},{"@parcel/transformer-js/src/esmodule-helpers.js":"cHUbl"}],cHUbl:[function(e,t,r){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach(function(r){"default"===r||"__esModule"===r||t.hasOwnProperty(r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})}),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}]},["d2v7F"],"d2v7F","parcelRequire5f87"),globalThis.define=t;