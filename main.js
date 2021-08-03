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
    constructor(cvsID, srcImages) {
        this.cvs = document.getElementById(cvsID); // канвас
        this.shadow = this.cvs.nextElementSibling; // абсолютный сосед
        this.ctx = this.cvs.getContext('2d'); // контекст
        this.srcData = srcImages; //массив путей
        this.bx = 0; // крайняя левая точка канваса
        this.by = 0; // крайняя верхняя точка канваса
        this.isRotate = false; //возможность вращения
        this.i = 0 // номер каринки
        this.event = {
            begin: 'mousedown',
            run: 'mousemove',
            end: 'mouseup',
            over: 'mouseenter',
            leave: 'mouseleave',
            beginX: 0,
            runX: 0,
            endX: 0,
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

        this.shadow.addEventListener('click', () => {
            this.shadow.children[0].classList.add('rotate-active');
            this.downloadAllImage();
            if (this.isRotate) {
                //стилизовать
                setTimeout(() => {
                    this.shadow.children[0].remove('rotate-active');
                    this.shadow.style.height = 0
                }, 500)
            }
        });

        // драг события
        this.cvs.addEventListener(this.event.begin, (e) => {
            this.event.beginX = this.event.begin === 'touchstart' ? e.touches[0].pageX : e.pageX;
            if (this.isRotate) {
                window.addEventListener(this.event.run, this.moveIt);
                window.addEventListener(this.event.end, (e) => {
                    this.event.endX = this.i;
                    console.log('endx', this.event.endX)
                    window.removeEventListener(this.event.run, this.moveIt);
                });
            }

        });
        // почва для вращения колесом
        this.cvs.addEventListener(this.event.over, () => {
            this.cvs.classList.add('cvs-active');
            this.cvs.addEventListener(this.event.leave, () => {
                this.cvs.classList.remove('cvs-active');
            });
        });

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
                this.isRotate = true;
                console.log(this.isRotate)
            }
        })
    }

    moveIt = (e) => {
        this.event.runX = this.event.beginX - (this.event.run === 'touchmove' ? e.touches[0].pageX : e.pageX);
        let pageX = Math.floor(this.event.runX / (1000 / 60));
        this.i = this.interval(pageX, this.srcData.length, this.event.endX);
        if (this.i > 0) {
            this.draw(this.srcData[this.srcData.length - this.i])
        } else if (this.i <= 0) {
            this.draw(this.srcData[Math.abs(this.i)])
        }
    }

    interval(coord, length, endX) {
        let int = Math.floor(coord / length);
        let newX = coord - (int * length);
        newX += endX;
        int = Math.floor(newX / length);
        newX = newX - (int * length);
        console.log(newX);
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


let b = new RotatingProduct('cvs', srcData)





/*
    1.Добавить endX чтобы не сбивались координаты - Complete
    2. разобраться с Sibling
    3. Разобраться с анимацией
    4. добавить событие колесикаб, если мышь находиться на канвасе
    5. убрать интервал в событии
*/