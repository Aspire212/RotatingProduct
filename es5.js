'use strict';

function _defineProperty(t, e, s) { return e in t ? Object.defineProperty(t, e, { value: s, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = s, t }
class RotatingProduct {
    constructor(t, e, s, i) {
        _defineProperty(this, "allMutation", () => { this.promises = [], this.srcData.forEach(t => this.mutation(t)), Promise.all(this.promises).then(t => { this.srcData = t, this.isRotate = !0, setTimeout(() => { this.isRotate && this.shadow.classList.add("shadow-cvs-hidden"), this.shadow.children[0].classList.remove("rotate-active"), this.shadow.children[0].style.height = 0, this.shadow.style.height = 0 }, 1e3) }) }), _defineProperty(this, "imageReplacementDrag", t => {
            window.getSelection().removeAllRanges(), this.focus = !0, this.focu = this.cvs.classList.add("cvs-active"), this.event.runX = this.event.beginX - ("touchmove" === this.event.run ? t.touches[0].pageX : t.pageX);
            let e = Math.floor(this.event.runX / (1e3 / 60));
            this.i = this.interval(e, this.srcData.length, this.event.endI), this.i > 0 ? this.draw(this.srcData[this.srcData.length - this.i]) : this.i <= 0 && this.draw(this.srcData[Math.abs(this.i)])
        }), _defineProperty(this, "imageReplacementWheel", t => {
            t.preventDefault();
            let e = t.deltaX,
                s = t.deltaY;
            Math.abs(this.i) >= this.srcData.length - 1 ? this.i = 0 : (e > -1 && e < 1 && s > 0 ? this.i += 1 : e > -1 && e < 1 && s < 0 ? this.i -= 1 : s > -1 && s < 1 && e > 0 ? this.i += 1 : s > -1 && s < 1 && e < 0 && (this.i -= 1), this.event.endI = this.i), this.i > 0 ? this.draw(this.srcData[this.srcData.length - this.i]) : this.i <= 0 && this.draw(this.srcData[Math.abs(this.i)])
        }), this.cvs = document.getElementById(t), this.cvs.width = e, this.cvs.height = s, this.shadow = this.cvs.nextElementSibling, this.body = document.querySelector("body"), this.ctx = this.cvs.getContext("2d"), this.srcData = i, this.bx = 0, this.by = 0, this.isRotate = !1, this.i = 0, this.focus = !1, this.isOver = !1, this.promises = [], this.event = { start: "click", begin: "mousedown", run: "mousemove", end: "mouseup", over: "mouseenter", leave: "mouseleave", wheel: "wheel", screen: "resize", isTouch: "ontouchstart", beginX: 0, runX: 0, endI: 0 }, this.mutation(this.srcData[0]), Promise.all(this.promises).then(t => { t.forEach(t => this.draw(t)) }), this.event.isTouch in document.documentElement && (this.event.start = "touchend", this.event.begin = "touchstart", this.event.run = "touchmove", this.event.end = "touchend"), this.shadow.addEventListener(this.event.start, () => { this.allMutation(), this.shadow.children[0].classList.add("rotate-active") }), this.cvs.addEventListener(this.event.begin, t => { this.event.beginX = "touchstart" === this.event.begin ? t.touches[0].pageX : t.pageX, this.cvs.style.cursor = "grabbing", this.body.style.cursor = "grabbing", !this.event.isTouch in document.documentElement && (this.body.style.overflow = "hidden"), this.isRotate && (window.addEventListener(this.event.run, this.imageReplacementDrag), window.addEventListener(this.event.end, t => { this.event.endI = this.i, this.cvs.style.cursor = "grab", this.body.style.cursor = "auto", !this.isOver && (this.focus = !1), !this.focus && this.cvs.classList.remove("cvs-active"), this.body.style.overflow = "auto", window.removeEventListener(this.event.run, this.imageReplacementDrag) })) }), this.cvs.addEventListener(this.event.over, () => { this.focus = !0, this.isOver = !0, this.cvs.classList.add("cvs-active"), this.cvs.addEventListener(this.event.wheel, this.imageReplacementWheel, { passive: !1 }), this.cvs.addEventListener(this.event.leave, () => { this.focus = !1, this.isOver = !1, !this.focus && this.cvs.classList.remove("cvs-active") }) })
    }
    draw(t) { this.ctx.drawImage(t, this.bx, this.by, this.cvs.width, this.cvs.height) }
    clear() { this.ctx.clearRect(this.bx, this.by, this.cvs.width, this.cvs.height) }
    mutation(t) {
        this.promises.push(new Promise((e, s) => {
            let i = new Image;
            i.onload = (() => e(i)), i.onerror = (() => s()), i.src = t
        }))
    }
    interval(t, e, s) {
        let i = Math.floor(t / e),
            h = t - i * e;
        return h += s, h -= (i = Math.floor(h / e)) * e
    }
}




//es5