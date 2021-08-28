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
        this.i = 0; // номер каринки
        this.focus = false; // для правильной работы фокуса в разных событиях
        this.isOver = false; // над чем мы
        this.isRotate = false; //возможность вращения
        this.promises = []; //пустой массив для сохранения загруженых изображений
        this.event = {
            start: 'click', // тригер для удаления заглушки и начала работы с канвасом
            begin: 'mousedown', // тригер для beginX
            run: 'mousemove', // тригер для runX
            end: 'mouseup', // тригер для endI и удаления тригера run
            over: 'mouseenter', //тригер для фокуса канваса
            leave: 'mouseleave', //тригер для удаления фокуса канваса
            wheel: 'wheel', //тригер для вращения колесом
            screen: 'resize', // изменение размера экрана
            isTouch: 'ontouchstart', // существуют ли тоуч события
            beginX: 0, // значение х при событии mousedown
            runX: 0, // значение х при событии mousemove
            endI: 0, // значение this при событии mouseup
        }; // объект содержащий названия событий и переменные для этих событий
        // изменяем первый элемент массива и загружаем его
        this.mutation(this.srcData[0]);
        //выводим ее в canvas
        Promise.all(this.promises).then(images => {
            images.forEach(img => this.draw(img))
        });
        // если устройство телефон - меняю события на телефонные
        if (this.event.isTouch in document.documentElement) {
            this.event.start = 'touchend'; // тригер для удаления заглушки и начала работы с канвасом
            this.event.begin = 'touchstart'; // тригер для beginX
            this.event.run = 'touchmove'; // тригер для runX
            this.event.end = 'touchend'; // тригер для endI и удаления тригера run
        }
        // событие начала
        this.shadow.addEventListener(this.event.start, () => {
            this.allMutation(); // преобразую строки в картинки
            this.shadow.children[0].classList.add('rotate-active'); // вращаю 360 пока загружаються картинки
        });
        // драг события
        this.cvs.addEventListener(this.event.begin, (e) => {
            this.event.beginX = this.event.begin === 'touchstart' ? e.touches[0].pageX : e.pageX; // получаю начальный Х
            this.cvs.style.cursor = 'grabbing'; // изменяю курсор на захват
            this.body.style.cursor = 'grabbing'; //изменяю курсор у всей страницы чтобы выходя за границу cvs курсор не менялся
            if (!this.event.isTouch in document.documentElement) {
                this.body.style.overflow = 'hidden'; //запрещаю прокрутку страницы пока работают драг события только для пк
            }
            if (this.isRotate) {
                window.addEventListener(this.event.run, this.imageReplacementDrag); // получаю динамический Х и отрисовываю вращение
                window.addEventListener(this.event.end, (e) => {
                    this.event.endI = this.i; // получаю последний индекс картинки
                    this.cvs.style.cursor = 'grab'; // возвращаю курсор
                    this.body.style.cursor = 'auto'; // возвращаю стандартное значение
                    !this.isOver && (this.focus = false); // отключаю фокус
                    !this.focus && this.cvs.classList.remove('cvs-active'); // удаляю класс фокуса
                    this.body.style.overflow = 'auto'; //разрешаю прокрутку поставив дефолтное значение, не ломаю телефонную прокрутку
                    window.removeEventListener(this.event.run, this.imageReplacementDrag); // прекращаю слежение за движениями мыши
                });
            }
        });
        // событие срабатывающее когда мышь находиться над канвасом
        this.cvs.addEventListener(this.event.over, () => {
            this.focus = true; // делаю фокус активным
            this.isOver = true; // на элементе
            this.cvs.classList.add('cvs-active'); // давляю класс показывающий тень, мол элемент в фокусе
            this.cvs.addEventListener(this.event.wheel, this.imageReplacementWheel, { passive: false }); //пока элемент в фокусе разрешаю вращение колесом
            this.cvs.addEventListener(this.event.leave, () => { // когда мышь уходит с канваса
                this.focus = false; // отключаю фокусн
                this.isOver = false; // ушли
                !this.focus && this.cvs.classList.remove('cvs-active'); // удаляю класс показывающий фокус
            });
        });
    };
    // метод отрисовки
    draw(img) {
        this.ctx.drawImage(img, this.bx, this.by, this.cvs.width, this.cvs.height);
    };
    //метод очистки холста
    clear() {
        this.ctx.clearRect(this.bx, this.by, this.cvs.width, this.cvs.height);
    };
    // метод меняющий путь на картинку и загружащий ее
    mutation(src) {
        this.promises.push(new Promise((resolve, reject) => { //создаю промис чтобы дождаться загрузку картинки
            let img = new Image(); //создаю картинку
            img.onload = () => resolve(img); //добавляю картинку в resolve если все хорошо
            img.onerror = () => reject(); // иначе ничего не бавляю
            img.src = src; //изменяю src картинки
        }))
    };
    // делаю стрелочную ф-цию чтобы не терялся this
    allMutation = () => {
        this.srcData.forEach(src => this.mutation(src));
        Promise.all(this.promises).then(images => {
            this.srcData = images; /// дождавшись выполнения всех промисов делаю srcData полностью загруженым
            this.isRotate = true; //разрешаю вращение
            setTimeout(() => {
                this.isRotate && this.shadow.classList.add('shadow-cvs-hidden'); // Добавляю класс который делает элемент прозрачным
                this.shadow.children[0].classList.remove('rotate-active'); // прикращаю вращать
                this.shadow.children[0].style.height = 0; //картинку в месте родительским елементом
                this.shadow.style.height = 0; // схлопываю перекрывающий элемент для возможности работы с канвас
            }, 1000); // искуственная задержка для анимации
        });
    };
    // метод вращения при помощи перетягивания
    imageReplacementDrag = (e) => {
        window.getSelection().removeAllRanges(); //запрещаю выделять текст
        this.focus = true; // пока работает move ащсгы активен
        this.focus = this.cvs.classList.add('cvs-active'); // возвращаю фокус до тех пор пока не отпустят мышь 128
        this.event.runX = this.event.beginX - (this.event.run === 'touchmove' ? e.touches[0].pageX : e.pageX); //получаю динамический Х
        let pageX = Math.floor(this.event.runX / (1000 / 60)); // делаю нужную мне скорость вращения
        this.i = this.interval(pageX, this.srcData.length, this.event.endI); //получаю индексе картинки
        if (this.i > 0) {
            this.draw(this.srcData[this.srcData.length - this.i]); //исходя из условия отрисовываю
        } else if (this.i <= 0) {
            this.draw(this.srcData[Math.abs(this.i)]); //исходя из условия отрисовываю
        }
    };
    //метод вращения колесом
    imageReplacementWheel = (e) => {
        e.preventDefault(); // отменяю скрол страницы пока курсор стоит на канвасе
        let x = e.deltaX;
        let y = e.deltaY;
        if (Math.abs(this.i) >= this.srcData.length - 1) {
            this.i = 0;
        } else {
            if (x > -1 && x < 1 && y > 0) this.i += 1; // скролл по вертикали
            else if (x > -1 && x < 1 && y < 0) this.i -= 1; // скролл по вертикали
            else if (y > -1 && y < 1 && x > 0) this.i += 1; // скролл по гризонтали
            else if (y > -1 && y < 1 && x < 0) this.i -= 1; // скролл по горизонтали
            this.event.endI = this.i; // для хранения координат
        }
        if (this.i > 0) {
            this.draw(this.srcData[this.srcData.length - this.i]); //исходя из условия отрисовываю
        } else if (this.i <= 0) {
            this.draw(this.srcData[Math.abs(this.i)]); //исходя из условия отрисовываю
        }
    };
    //метод расчета интервалов
    interval(coord, length, endI) {
        let int = Math.floor(coord / length); // получаю интервал исходя и координат / количество картинок в массиве
        let newX = coord - (int * length); // нахожу конркретное значение в интервале
        newX += endI; // добавляю предыдущее значение
        int = Math.floor(newX / length); // получаю интервал исходя старое + новое значение / количество картинок в массиве
        newX = newX - (int * length); // нахожу конркретное значение в интервале
        return newX;
    };
}




window.addEventListener('DOMContentLoaded', () => {


    let test = new RotatingProduct('cvs', 400, 400, srcData);

});






/*
    1.Добавить endX чтобы не сбивались координаты - Complete
    2. Разобраться с Sibling - Complete
    3. Разобраться с анимацией - Complete
    4. Добавить событие колесика, если мышь находиться на канвасе - Complete
    5. Убрать интервал в событии - Complete
    6. Добавить второй cvs-active с теми же стилями но зависящий от драг событий - Complete
    7. Переработать пропадание shadow на канвасе - Complete
    8. добавлять соседний элемент чепез конструктор  - передумал
    9. если по соседству будут элементы с другим курсором то менять курсом элементам добавляя класс при помощи цикла
    10. запретить скрол страницы во время драг - Complete
    11. Разбить allMutation на несколько методов
    12. Добавть размеры для медиазапросов -  рулиться css
*/