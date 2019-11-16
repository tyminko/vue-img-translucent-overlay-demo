<template>
  <div class="img-trans-overlay-wrap">
    <img ref="img"
        :src="src"
        :srcset="srcset"
        :sizes="sizes"
        :alt="alt"
        :height="height"
        :width="width"
        :crossorigin="crossorigin"
        :decoding="decoding">
    <div ref="overlay" class="img-trans-overlays">
      <slot />
    </div>
  </div>
</template>

<script>
import uniqueString from './uniqueString'
export default {
  name: 'ImgTransOverlay',
  props: {
    src: { type: String, default: '' },
    srcset: { type: String, default: null },
    sizes: { type: String, default: null },
    alt: { type: String, default: '' },
    height: { type: Number, default: null },
    width: { type: Number, default: null },
    crossorigin: { type: String, default: null, validator: v => !v || v === 'anonymous' || v === 'use-credentials' },
    decoding: { type: String, default: null, validator: v => !v || v === 'sync' || v === 'async' || v === 'auto' },

    oBlur: { type: Number, default: 3 },

    oBrightness: { type: Number, default: null },
    oContrast: { type: Number, default: null },
    oGrayscale: { type: Number, default: null },
    oHueRotate: { type: Number, default: null },
    oInvert: { type: Number, default: null },
    oSaturate: { type: Number, default: null },
    oSepia: { type: Number, default: null },
    oOpacity: { type: Number, default: null },

    oFillOpacity: { type: Number, default: 0.5 },
    oFillColor: { type: String, default: '#fff' },
    oSoftEdge: Boolean,
    color: { type: String, default: null },

    scrollable: Boolean,

    updateOnWinResize: { type: Boolean, default: true }
  },

  data: () => ({
    img: null,
    /** @type CSSStyleDeclaration */
    imgCSS: null,
    elements: {},
    timeouts: {},
    observers: {}
  }),

  computed: {
    filteStr () {
      let filter = this.oBlur !== null ? ` blur(${this.oBlur}px)` : ''
      filter += this.oBrightness !== null ? ` brightness(${this.oBrightness}%)` : ''
      filter += this.oContrast !== null ? ` contrast(${this.oContrast}%)` : ''
      filter += this.oGrayscale !== null ? ` grayscale(${this.oGrayscale}%)` : ''
      filter += this.oHueRotate !== null ? ` huerotate(${this.oHueRotate}deg)` : ''
      filter += this.oInvert !== null ? ` invert(${this.oInvert}%)` : ''
      filter += this.oOpacity !== null ? ` saturate(${this.oOpacity}%)` : ''
      filter += this.oSaturate !== null ? ` saturate(${this.oSaturate}%)` : ''
      filter += this.oSepia !== null ? ` sepia(${this.oSepia}%)` : ''
      return filter
    },
    blurWidthFactor () { return this.oSoftEdge ? 1 : 2 },
    styleBgElSizeStr () { return `calc(100% + ${this.oBlur * this.blurWidthFactor * 2}px)` },
    styleBgElPlacementStr () { return `-${this.oBlur * this.blurWidthFactor}px` }
  },

  watch: {
    src (value) { this.update() }
  },

  mounted () {
    /** @type HTMLImageElement */
    this.img = this.$refs['img']
    //
    this.img.addEventListener('load', () => {
      this.imgCSS = window.getComputedStyle(this.img)
      this.update()
    })
    if (this.updateOnWinResize) {
      window.addEventListener('resize', (e) => {
        this.update()
      })
    }
  },

  methods: {
    /**
     * @param {HTMLElement} overlayEl
     * @param {string} key
     */
    updateOverlayEl (overlayEl, key) {
      key = overlayEl.dataset.overlayKey
      let bgEl, bgImg
      if (key & this.elements.hasOwnProperty(key)) {
        bgEl = this.elements[key].bgEl
        bgImg = this.elements[key].bgImg
      } else {
        // overlayWrap = overlayEl.querySelector(':scope > .io-bg-wrap')
        bgEl = overlayEl.querySelector(':scope > [data-io-bg-el]')
        if (!bgEl) {
          // overlayWrap = document.createElement('div')
          // overlayWrap.classList.add('io-bg-wrap')
          // overlayEl.parentNode.insertBefore(overlayWrap, overlayEl)
          // overlayWrap.appendChild(overlayEl)
          // overlayEl.innerHTML = `<div class="io-bg-wrap">${overlayEl.innerHTML}</div>`

          bgEl = this.setupBgEl(overlayEl)
          bgImg = this.setupBgImg()
          bgEl.appendChild(bgImg)
          overlayEl.prepend(bgEl)
          // overlayEl.prepend(overlayWrap)
        } else {
          bgEl = overlayEl.querySelector(':scope > [data-io-bg-el]')
          bgImg = bgEl.querySelector(':scope > img')
          if (!bgImg) {
            bgImg = this.setupBgImg()
            bgEl.appendChild(bgImg)
          }
        }
      }
      if (bgImg.src !== this.img.src) {
        bgImg.src = this.img.src
      }
      this.updateBgImageStyles(bgImg)
      this.updateBgImagePlacement(bgImg)
      if (this.color !== null) overlayEl.style.color = this.color
    },

    /**
     * @param {HTMLElement} overlayEl
     * @return {HTMLElement}
     */
    setupBgEl (overlayEl) {
      const bgEl = document.createElement('span')
      bgEl.dataset.ioBgEl = true
      bgEl.classList.add('io-bg')

      const style = bgEl.style
      style.display = `block`
      style.position = `absolute`
      style.top = this.styleBgElPlacementStr
      style.left = this.styleBgElPlacementStr
      style.width = this.styleBgElSizeStr
      style.height = this.styleBgElSizeStr
      style.borderRadius = `${window.getComputedStyle(overlayEl).borderRadius}`
      style.overflow = 'hidden'
      style.zIndex = `-1`

      style.background = this.oFillColor

      if (this.oSoftEdge) style.overflow = 'hidden'

      style.filter = this.filteStr

      return bgEl
    },

    /**
     * @param {HTMLElement} overlayEl
     */
    updateBgElPlacement (overlayEl) {
      // const bgEl = overlayEl.querySelector(':scope > [data-io-bg-el]')
      // if (!bgEl) return
      // const s = bgEl.style
      // const d = s.display
      // s.display = 'none'
      // const h = overlayEl.scrollHeight
      // s.display = d
      // const maxTop = h - overlayEl.getBoundingClientRect().height - this.oBlur * this.blurWidthFactor
      // /* DEBUG */
      // console.log(`%c %c maxTop: `, 'background:#ffbb00;color:#000', 'color:#00aaff', maxTop)
      // const top = overlayEl.scrollTop - this.oBlur * this.blurWidthFactor
      // /* DEBUG */
      // console.log(`%c %c top: `, 'background:#ffbb00;color:#000', 'color:#00aaff', top)
      // s.top = `${Math.min(maxTop, top)}px`
      // /* DEBUG */
      // console.log(`%c %c s.top: `, 'background:#ffbb00;color:#000', 'color:#00aaff', s.top)
    },

    /**
     * @return {HTMLElement}
     */
    setupBgImg () {
      const bgImg = this.img.cloneNode()
      bgImg.style.position = 'absolute'
      bgImg.style.minWidth = `0`
      bgImg.style.minHeight = '0'
      bgImg.style.maxWidth = `unset`
      bgImg.style.maxHeight = 'unset'
      return bgImg
    },

    /**
     * @param {HTMLElement} bgImg
     */
    updateBgImagePlacement (bgImg) {
      // Get clean rect without transformations
      let tempTrasform = this.img.style.transform
      bgImg.style.transform = 'none'
      const bgRect = bgImg.parentElement.getBoundingClientRect()
      bgImg.style.transform = tempTrasform

      // Get clean rect without transformations
      tempTrasform = this.img.style.transform
      this.img.style.transform = 'none'
      const imgRect = this.img.getBoundingClientRect()
      this.img.style.transform = tempTrasform

      const offsetLeft = bgRect.left - imgRect.left
      const offsetTop = bgRect.top - imgRect.top

      const s = bgImg.style

      s.left = `${-offsetLeft}px`
      s.top = `${-offsetTop}px`

      if (offsetLeft < 1 || offsetTop < 1) {
        bgImg.style.transform = `${this.imgCSS.transform} scale(${1 + this.oBlur * 0.01})`
      } else {
        bgImg.style.transform = this.imgCSS.transform
      }
    },

    /**
     * @param {HTMLElement} bgImg
     */
    updateBgImageStyles (bgImg) {
      const cssBgImg = window.getComputedStyle(bgImg)
      const excepts = [
        'display',
        'position',
        'left',
        'top',
        'right',
        'bottom',
        'transform',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'opacity']
      Array.from(this.imgCSS).forEach(rule => {
        if (excepts.indexOf(rule) > -1) return
        if (cssBgImg[rule] !== this.imgCSS[rule]) bgImg.style[rule] = this.imgCSS[rule]
      })

      bgImg.style.opacity = 1 - this.oFillOpacity
    },

    /**
     * @param {HTMLElement} bgImg
     */
    updateBgImageAppearance (bgImg) {
      const { objectFit, objectPosition, width, height } = window.getComputedStyle(this.img)
      const s = bgImg.style
      if (s.objectFit !== objectFit) s.objectFit = objectFit
      if (s.objectPosition !== objectPosition) s.objectPosition = objectPosition
      if (s.width !== width) s.width = width
      if (s.height !== height) s.height = height
    },

    update () {
      /** @type HTMLElement */
      const overlay = this.$refs['overlay']
      if (!overlay) return
      overlay.querySelectorAll(':scope > *').forEach((/** @type HTMLElement */ el, i) => {
        if (!el.dataset.ioElKey) {
          el.dataset.ioElKey = uniqueString(i)
          this.addOverlayElementObserver(el)
        }
        if (!el.style.zIndex) el.style.zIndex = 0
        const scrollable = el.classList.contains('io-scrollable')
        el.style.overflow = this.oSoftEdge && !scrollable
          ? 'visible'
          : (scrollable ? 'auto' : 'hidden')
        this.updateOverlayEl(el)
      })
    },

    checkForOverlayRectChage (el) {
      const key = el.dataset.ioElKey
      if (!key) return
      const observer = this.observers[key]
      const { left, top, right, bottom } = el.getBoundingClientRect()
      const lastRect = observer.lastRect
      if (el.classList.contains('footer')) {
      }
      if (lastRect.left !== left ||
          lastRect.top !== top ||
          lastRect.right !== right ||
          lastRect.bottom !== bottom) {
        const now = Date.now()
        if (!this.iot) this.iot = now

        this.updateOverlayEl(el)
        observer.lastRect = { left, top, right, bottom }
        observer.checkCount = 0
        this.iot = now
      } else {
        observer.checkCount += 1
      }
      if (observer.checkCount < 10) {
        observer.checkTimeout = setTimeout(requestAnimationFrame(() => {
          this.checkForOverlayRectChage(el)
        }), (observer.checkCount + 1) * 20) // slowdown checking for a change. the last (10th) check will be in 1100ms after the first one
      }
    },

    /**
     * @param {HTMLElement} overlayEl
     */
    addOverlayElementObserver (overlayEl) {
      let key = overlayEl.dataset.ioElKey
      if (!key) key = overlayEl.dataset.ioElKey = uniqueString()

      const config = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      }
      this.observers[key] = {
        observer: new MutationObserver(mutations => {
          const observer = this.observers[key]
          const now = Date.now()
          if (now - observer.lastMutation > 16) { // don't react on the mutations that could happen quicker then 60fps
            observer.lastMutation = now
            clearTimeout(observer.checkTimeout)
            observer.checkCount = 0
            this.checkForOverlayRectChage(overlayEl)
          }
        }),
        lastMutation: null,
        lastRect: { left: null, top: null, right: null, bottom: null },
        checkTimeout: null,
        checkCount: 0
      }
      this.observers[key].observer.observe(overlayEl, config)

      // add scroll listener
      if (overlayEl.classList.contains('io-scrollable')) {
        overlayEl.addEventListener('scroll', () => {
          requestAnimationFrame(() => {
            this.updateBgElPlacement(overlayEl)
          })
        })
      }
    },

    id (prefix) {
      return `${prefix}${Math.random().toString(36).substr(2, 9)}`
    }
  }
}
</script>

<style lang='scss'>
.img-trans-overlay-wrap {
  position: relative;
  overflow: hidden;
  .img-trans-overlays {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .io-bg-wrap {
      // position: absolute;
      // top: 0;
      // left: 0;
      // width: 100%;
      // height: 100px;
      overflow: auto;
      // pointer-events: none;
    }
  }
}
</style>
