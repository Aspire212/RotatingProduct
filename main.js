'use strict';
let srcData = [
    "images/SPBG130-35900-01.jpg",
    "images/SPBG130-35900-02.jpg",
    "images/SPBG130-35900-03.jpg",
    "images/SPBG130-35900-04.jpg",
    "images/SPBG130-35900-05.jpg",
    "images/SPBG130-35900-06.jpg",
    "images/SPBG130-35900-07.jpg",
    "images/SPBG130-35900-08.jpg",
    "images/SPBG130-35900-09.jpg",
    "images/SPBG130-35900-10.jpg",
    "images/SPBG130-35900-11.jpg",
    "images/SPBG130-35900-12.jpg",
    "images/SPBG130-35900-13.jpg",
    "images/SPBG130-35900-14.jpg",
    "images/SPBG130-35900-15.jpg",
    "images/SPBG130-35900-16.jpg",
    "images/SPBG130-35900-17.jpg",
    "images/SPBG130-35900-18.jpg",
    "images/SPBG130-35900-19.jpg",
    "images/SPBG130-35900-20.jpg"
]




class RotatingProduct {
    constructor(cvsID, cvsWidth, cvsHeight, srcImages) {
        /*тестовые*/
        this.range = document.getElementById('range');
        /*тестовые*/
        this.cvs = document.getElementById(cvsID); // канвас
        this.cvs.width = cvsWidth; // ширина канваса
        this.cvs.height = cvsHeight; // высота канваса
        this.ctx = this.cvs.getContext('2d'); // контекст
        this.srcData = srcImages; //массив путей
        this.bx = 0; // крайняя левая точка канваса
        this.by = 0; // крайняя верхняя точка канваса
        this.rotate = false; //возможность вращения
        this.event = {
            begin: 'mousedown',
            run: 'mousemove',
            end: 'mouseup',
            beginX: 0,
            runX: 0,
        }; // объект содержащий названия событий и переменные для этих событий

        //изменяем первый элемент массива и загружаем его
        this.downloadImage(this.srcData, 1);

        //выводим ее в canvas
        this.srcData[0].addEventListener('load', () => this.draw(this.srcData[0]));

        // если устройство телефон - меня события на телефонные
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            this.event.begin = 'touchstart';
            this.event.run = 'touchmove';
            this.event.end = 'touchend';
        }

        // драг события
        this.cvs.addEventListener(this.event.begin, (e) => {
            this.event.beginX = this.event.begin === 'touchstart' ? e.touches[0].pageX : e.pageX;
            if (this.rotate) {
                window.addEventListener(this.event.run, this.moveIt);
                window.addEventListener(this.event.end, (e) => {
                    window.removeEventListener(this.event.run, this.moveIt);
                });
            }

        });
        // по наведению на канвас загружаю все картинки
        this.cvs.addEventListener('mouseenter', this.downloadAllImage);

    }

    draw(img) {
        this.ctx.drawImage(img, this.bx, this.by, this.cvs.width, this.cvs.height);
    }

    clear() {
        this.ctx.clearRect(this.bx, this.by, this.cvs.width, this.cvs.height);
    }

    downloadImage(imgData, amountMutation) {
        for (let i = 0; i < amountMutation; i++) {
            let img = new Image();
            if (typeof imgData[i] === 'string') {
                img.src = imgData[i];
                imgData[i] = img;
            }
        }
        console.log(imgData);
    }

    /*делаю стрелочную ф-цию чтобы не терялся this*/

    downloadAllImage = () => {
        //показать прелоадер
        this.downloadImage(this.srcData, this.srcData.length)
        this.srcData.every(el => {
            if (el instanceof Object) {
                this.cvs.removeEventListener('mouseenter', this.downloadAllImage);
                this.rotate = true;
                console.log(this.rotate)
            }
        })
    }

    moveIt = (e) => {
        this.event.runX = this.event.beginX - (this.event.run === 'touchmove' ? e.touches[0].pageX : e.pageX);
        let pageX = ~~(this.event.runX / (1000 / 60));

        let x = this.interval(pageX, this.srcData.length)

        if (x > 0) {
            this.draw(this.srcData[this.srcData.length - x])

        } else if (x <= 0) {
            this.draw(this.srcData[Math.abs(x)])
        }

    }

    interval(coord, length) {
        let i = ~~(coord / length);
        let newX = coord - (i * length);
        //console.log('coord:', coord, 'length:', length, 'i:', i, 'newX:', newX)
        return newX;
    }

    ///тестовые

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.bx, this.by, this.cvs.width, this.cvs.height);
    }

    spin(rangeData) {
            let val = +rangeData.value;
            let max = +rangeData.max;
            return val = val < 0 ? max + val : val;
        }
        ///тестовые
}


let b = new RotatingProduct('cvs', 400, 400, srcData)









//  /*ТЕСТОВЫЕ*/
//  
//  this.range.addEventListener('input', () => {
//      if (this.rotate) {
//          this.clear()
//          this.draw(this.srcData[this.spin(this.range)])
//      }
//  });
//  /*ТЕСТОВЫЕ*/



// controlAll.forEach(control => {
//     scaleAll.forEach(scale => {
//         let volume;
//         control.addEventListener(begin, function(e) {
//             let centerX = this.offsetWidth / 2;

//             function moveAt(e) {
//                 let pX = run === 'touchmove' ? e.touches[0].pageX : e.pageX;
//                 volume = pX - scale.getBoundingClientRect().x - centerX;
//                 if (volume >= scale.offsetWidth - control.offsetWidth) {
//                     volume = scale.offsetWidth - control.offsetWidth;
//                 }
//                 if (volume <= 0) {
//                     volume = 0;
//                 }

//                 control.style.left = $ { volume }
//                 px;

//                 if (control.dataset.s === 'sound') {
//                     //sound.volume = volume / 180;
//                 }
//                 if (control.dataset.s === 'music') {
//                     //mus.volume = volume / 180;
//                 }

//             }
//             document.addEventListener(run, moveAt)
//             window.addEventListener(end, function(e) {
//                 document.removeEventListener(run, moveAt)
//             });
//         });
//     });

// });