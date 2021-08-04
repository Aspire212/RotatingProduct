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
];
class RotatingProduct {
    constructor(cvsID, width, height, srcData) {
        this.cvs = document.getElementById(cvsID); // канвас
        this.cvs.width = width; // ширина канваса
        this.cvs.height = height; // высота канваса
        this.shadow = this.cvs.nextElementSibling; // абсолютный сосед
        this.body = document.querySelector('body'); //вся страница
        this.ctx = this.cvs.getContext('2d'); // пространство работы
        this.srcData = srcData; //массив путей
        this.bx = 0; // крайняя левая точка канваса
        this.by = 0; // крайняя верхняя точка канваса
        this.isRotate = false; //возможность вращения
        this.i = 0 // номер каринки
        this.event = {
            start: 'click', // тригер для удаления заглушки и начала работы с канвасом
            begin: 'mousedown', // тригер для beginX
            run: 'mousemove', // тригер для runX
            end: 'mouseup', // тригер для endI и удаления тригера run
            over: 'mouseenter', //тригер для фокуса канваса
            leave: 'mouseleave', //тригер для удаления фокуса канваса
            wheel: 'wheel', //тригер для вращения колесом
            beginX: 0, // значение х при событии mousedown
            runX: 0, // значение х при событии mousemove
            endI: 0, // значение this при событии mouseup
        }; // объект содержащий названия событий и переменные для этих событий
        // изменяем первый элемент массива и загружаем его
        this.srcData[0] = this.mutation(this.srcData[0]);
        //выводим ее в canvas
        this.srcData[0].addEventListener('load', () => this.draw(this.srcData[0]));
        // если устройство телефон - меня события на телефонные
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            this.event.start = 'touchend'; // тригер для удаления заглушки и начала работы с канвасом
            this.event.begin = 'touchstart'; // тригер для beginX
            this.event.run = 'touchmove'; // тригер для runX
            this.event.end = 'touchend'; // тригер для endI и удаления тригера run
        }
        // событие начала
        this.shadow.addEventListener(this.event.start, () => {
            this.shadow.children[0].classList.add('rotate-active'); // запускаю анимацию пока работает allMuttion
            this.allMutation(); // преобразую строки в картинки
            if (this.isRotate) { // проверка на возможность вращения
                // искуственная задержка
                setTimeout(() => {
                    this.shadow.children[0].remove('rotate-active'); // останавливаю анимацию
                    this.shadow.style.height = 0; // удаляю перекрывющий канвас элемент  -- переделать на класс
                }, 500);
            }
        });
        // драг события
        this.cvs.addEventListener(this.event.begin, (e) => {
            this.event.beginX = this.event.begin === 'touchstart' ? e.touches[0].pageX : e.pageX; // получаю начальный Х
            this.cvs.style.cursor = 'grabbing'; // изменяю курсор на захват
            this.body.style.cursor = 'grabbing'; //изменяю курсор у всей страницы чтобы выходя за границу cvs курсор не менялся
            if (this.isRotate) {
                window.addEventListener(this.event.run, this.imageReplacementDrag); // получаю динамический Х и отрисовываю вращение
                window.addEventListener(this.event.end, (e) => {
                    this.event.endI = this.i; // получаю последний индекс картинки
                    this.cvs.style.cursor = 'grab'; // возвращаю курсор
                    this.body.style.cursor = 'auto'; // возвращаю стандартное значение
                    this.cvs.classList.remove('cvs-active'); // удаляю фокус
                    window.removeEventListener(this.event.run, this.imageReplacementDrag); // прекращаю слежение за движениями мыши
                });
            }
        });
        // событие срабатывающее когда мышь находиться над канвасом
        this.cvs.addEventListener(this.event.over, () => {
            this.cvs.classList.add('cvs-active'); // давляю класс показывающий тень, мол элемент в фокусе
            this.cvs.addEventListener(this.event.wheel, this.imageReplacementWheel) //пока элемент в фокусе разрешаю вращение колесом
            this.cvs.addEventListener(this.event.leave, () => { // когда мышь уходит с канваса
                this.cvs.classList.remove('cvs-active'); // удаляю класс показывающий фокус
            });
        });
    };
    // метод отрисовки
    draw(img) {
            this.ctx.drawImage(img, this.bx, this.by, this.cvs.width, this.cvs.height);
        }
        //метод очистки холста
    clear() {
        this.ctx.clearRect(this.bx, this.by, this.cvs.width, this.cvs.height);
    };
    // метод меняющий путь на картинку
    mutation(el) {
        let img = new Image(); // создаю картинку
        if (typeof el === 'string') { //проверяю элементы на строку
            img.src = el; // добавляю путь к картинке
            return img; // заменяю строку с путем к картинке в массиве на картинку
        } else {
            return el; //если не строка, ничего не делаю
        }
    };
    // делаю стрелочную ф-цию чтобы не терялся this
    allMutation = () => {
        //изменяю все элементы
        this.srcData = this.srcData.map(el => el = this.mutation(el));
        this.srcData.every(el => {
            if (el instanceof Object) { // если все элементы массива стали объектами
                this.isRotate = true; //разрешаю вращение
                console.log(this.isRotate)
            }
        });
    };
    // метод вращения при помощи перетягивания
    imageReplacementDrag = (e) => {
        !this.cvs.classList.contains('cvs-active') && this.cvs.classList.add('cvs-active'); // возвращаю фокус до тех пор пока не отпустят мышь 128
        this.event.runX = this.event.beginX - (this.event.run === 'touchmove' ? e.touches[0].pageX : e.pageX); //получаю динамический Х
        let pageX = Math.floor(this.event.runX / (1000 / 60)); // делаю нужную мне скорость вращения
        this.i = this.interval(pageX, this.srcData.length, this.event.endI); //получаю индексе картинки
        if (this.i > 0) {
            this.draw(this.srcData[this.srcData.length - this.i]) //исходя из условия отрисовываю
        } else if (this.i <= 0) {
            this.draw(this.srcData[Math.abs(this.i)]) //исходя из условия отрисовываю
        }
    };
    //метод вращения колесом
    imageReplacementWheel = (e) => {
        e.preventDefault(); // отменяю скрол страницы пока курсор стоит на канвасе
        if (Math.abs(this.i) >= this.srcData.length - 1) {
            this.i = 0;
        } else {
            this.i += e.deltaY > 0 ? 1 : -1; // в зависимости от напрвления движения вращаю изображение
            this.event.endI = this.i; // для хранения координат
        }
        if (this.i > 0) {
            this.draw(this.srcData[this.srcData.length - this.i]) //исходя из условия отрисовываю
        } else if (this.i <= 0) {
            this.draw(this.srcData[Math.abs(this.i)]) //исходя из условия отрисовываю
        }
    };
    //метод расчета интервалов
    interval(coord, length, endI) {
        let int = Math.floor(coord / length); // получаю интервал исходя и координат / количество картинок в массиве
        let newX = coord - (int * length); // нахожу конркретное значение в интервале
        newX += endI; // добавляю предыдущее значение
        int = Math.floor(newX / length); // получаю интервал исходя старое + новое значение / количество картинок в массиве
        newX = newX - (int * length); // нахожу конркретное значение в интервале
        //console.log('coord:', coord, 'length:', length, 'i:', i, 'newX:', newX)
        return newX;
    };
}




window.addEventListener('DOMContentLoaded', () => {


    let test = new RotatingProduct('cvs', 400, 400, srcData);

});





/*
    1.Добавить endX чтобы не сбивались координаты - Complete
    2. Разобраться с Sibling
    3. Разобраться с анимацией
    4. Добавить событие колесика, если мышь находиться на канвасе - Complete
    5. Убрать интервал в событии - Complete
    6. Добавить второй cvs-active с теми же стилями но зависящий от драг событий
    7. Переработать пропадание ырфвщц на канвасе
    8. добавлять соседний элемент чепез конструктор
    9. если по соседству будут элементы с другим курсором то менять курсом элементам добавляя класс при помощи цикла
*/