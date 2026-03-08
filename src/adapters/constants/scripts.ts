export const WATERMARK_BLOCKER_CODE = `
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
`
