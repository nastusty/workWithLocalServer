document.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
           item.classList.add('hide'); 
           item.classList.remove('show', 'fade');
        });

        tabs.forEach (item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.matches('div.tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadLine = '2020-11-14';

    function getTimeRemaining (endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / (1000*60)) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };

    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timerInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t <= 0) {
                clearInterval(timerInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    //Modal

    const btnModalOpen = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    btnModalOpen.forEach(item => {
        item.addEventListener('click', openModal);
    });
    
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.querySelectorAll('form').forEach(item => item.reset());
    }
   
      
    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', e => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //create class for menu-item

    class MenuCard {
        constructor(src, alt, title, description, cost, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.cost = cost;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeValuta();
        }

        changeValuta() {
            this.cost = this.cost * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            } else {
            this.classes.forEach(className => element.classList.add(className));                
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.cost}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }

        
    }

    const getResourse = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        } 
        return await res.json(); 
    }

    // getResourse('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                 new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         price = price * 78;
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }
    // getResourse('http://localhost:3000/menu')
    // .then(data => createCard(data));

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thank you! We will connect you soon.',
        failure: 'Somethink wrong...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-type': 'application/json'
            }
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
           e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.setAttribute('src', message.loading);
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

           const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries())); //конвертируем из типа fornData в json

           postData('http://localhost:3000/requests', json)
           .then(response => {
                console.log(response);
                showThansModal(message.success);   
                statusMessage.remove();
           })
           .catch(() => {
            showThansModal(message.failure);
           })
           .finally(() => form.reset())
        });
    }

    function showThansModal(message) {
        const PrevModalDialog = document.querySelector('.modal__dialog');

        PrevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div class = "modal__close" data-close>&times;</div>
                <div class = "modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            PrevModalDialog.classList.remove('hide');
            PrevModalDialog.classList.add('show');
            closeModal();
        }, 4000);
    }

    // fetch('http://localhost:3000/menu')
    // .then(data => data.json())
    // .then(res => console.log(res));


    //Slider

    const leftArrow = document.querySelector('.offer__slider-prev'),
        rightArrow = document.querySelector('.offer__slider-next'),
        totalAmount = document.getElementById('total'),
        currentAmount = document.getElementById('current'),
        slides = document.querySelectorAll('.offer__slide'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesFeild = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        widthOffset = Math.round(+width.replace(/[^\d.]/g, ''));

    let index = 1;
    let offset = 0;


    if (slides.length < 10) {
        totalAmount.textContent = `0${slides.length}`;
        currentAmount.textContent = `0${index}`;
    } else {
        totalAmount.textContent = slides.length;
        currentAmount.textContent = index;
    }

    slidesFeild.style.width = 100 * slides.length + '%';
    slidesFeild.style.display = 'flex';
    slides.forEach(slide => slide.style.width = width);    
    slidesFeild.style.transition = '0.5s all';


    slidesWrapper.style.overflow = 'hidden';

    function controlCurrent () {
        if (slides.length < 10) {
            currentAmount.textContent = `0${index}`;
        } else {
            currentAmount.textContent = index;
        }
    }

    rightArrow.addEventListener('click', () => {
        if (offset == widthOffset * (slides.length - 1)) { 
            offset = 0;
        } else {
            offset += widthOffset;
        }
        slidesFeild.style.transform = `translateX(-${offset}px)`;

        if (index == slides.length) {
            index = 1;
        } else {
            index++;
        }

        controlCurrent();
    });

    leftArrow.addEventListener('click', () => {
        if (offset == 0) { 
            offset = widthOffset * (slides.length - 1);
        } else {
            offset -= widthOffset;
        }
        slidesFeild.style.transform = `translateX(-${offset}px)`;

        if (index == 1) {
            index = slides.length;
        } else {
            index--;
        }

        controlCurrent();
    });



    /*  1 ВАРИАНТ ИВАНА   */

    // showSlide(index);

    // if (slides.length < 10) {
    //     totalAmount.textContent = `0${slides.length}`;
    // } else {
    //     totalAmount.textContent = slides.length;
    // }

    // function showSlide(n) {
    //     if (n > slides.length) {
    //         index = 1;
    //     } 
    //     if (n < 1) {
    //         index = slides.length;
    //     }

    //     slides.forEach(item => {
    //         item.classList.remove('show', 'fade');
    //         item.classList.add('hide');
    //     });
    //     slides[index-1].classList.remove('hide');
    //     slides[index-1].classList.add('show', 'fade'); 
        
    //     if (n < 10) {
    //         currentAmount.textContent = `0${index}`;
    //     } else {
    //         currentAmount.textContent = index;
    //     }
    // }

    // function plus(n) {
    //     showSlide(index += n);
    // }

    // leftArrow.addEventListener('click', () => {
    //     plus(-1);
    // });
    // rightArrow.addEventListener('click', () => {
    //     plus(1);
    // });

    /*   КОНЕЦ 1 ВАРИАНТА ИВАНА   */



    /*   МОЙ ВАРИАНТ   */

    // function addZero(index, amount) {
    //     if (index < 10) {
    //     amount.textContent = `0${index}`;
    //     } else {
    //         amount.textContent = index;
    //     }
    // }

    // addZero(slides.length, totalAmount);

    // function hideSlider() {
    //     slides.forEach((item) => {
    //         item.classList.add('hide');
    //         item.classList.remove('show', 'fade');
    //     })
    // }

    // function showSlider(i = 0) {
    //     slides[i].classList.add('show', 'fade');
    //     slides[i].classList.remove('hide');
    //     addZero(i+1, currentAmount);
    // }

    // hideSlider();
    // showSlider();

    // rightArrow.addEventListener('click', () => {
    //     let index;
        
    //     slides.forEach((item, i) => {
    //         if (item.classList.contains('show')) {
    //             if (i === slides.length-1) {
    //                 index = 0;
    //             } else {
    //                index = i+1; 
    //             }
                
    //         }
    //     });
    //     hideSlider();
    //     showSlider(index);
    // });

    // leftArrow.addEventListener('click', () => {
    //     let index;
    //     slides.forEach((item, i) => {
    //         if (item.classList.contains('show')) {
    //             if (i === 0) {
    //                 index = slides.length-1;
    //             } else {
    //                index = i-1; 
    //             }
                
    //         }
    //     });
    //     hideSlider();
    //     showSlider(index);
    // });

    /*   КОНЕЦ МОЕГО ВАРИАНТА  */

    // Создаем навигацию (кружочки) для слайдов

    const slider = document.querySelector('.offer__slider'),
          carousel = document.createElement('ol'),
          dots = [];

    slider.style.position = 'relative';
    carousel.classList.add('carousel-indicators');
    slider.append(carousel);

    slides.forEach((item, i) => {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        carousel.append(dot);
        dots.push(dot);
    });

    rightArrow.addEventListener('click', () => {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[index - 1].style.opacity = 1;
    });

    leftArrow.addEventListener('click', () => {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[index - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            dots.forEach(dot => dot.style.opacity = '0.5');
            dot.style.opacity = 1;

            const slideTo = e.target.getAttribute('data-slide-to');
            index = slideTo;
            offset = widthOffset * (slideTo - 1)
            slidesFeild.style.transform = `translateX(-${offset}px)`;

            controlCurrent();
        });
    })

    // Калькулятор

    const result = document.querySelector('.calculating__result span'),
          gender = document.querySelectorAll('#gender div'),
          activity = document.querySelectorAll('.calculating__choose_big div'),
          dymanicElem = document.querySelectorAll('.calculating__choose_medium input');
    let sex = 'female', 
    height, weight, age, 
    ration = 1.35;
console.log(dymanicElem);
    function calcResult() {
        if (!sex || !height || !weight || !age || !ration) {
            result.textContent = '    ';
        }
        else if (sex === 'female') {
           return result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ration);
        } else { // if (sex === 'male')
            return result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ration);
        }
    }

    calcResult();

    function getStaticInf(elems, activeClass) {
        elems.forEach((item) => {
            item.addEventListener('click', e => {
                if (e.target.getAttribute('data-ration')) {
                    ration = +e.target.getAttribute('data-ration');
                } else {
                    sex = e.target.getAttribute('id');
                }

                elems.forEach((elem) => elem.classList.remove(activeClass));
                e.target.classList.add(activeClass);

                calcResult();
            });
        });

    }
    getStaticInf(gender, 'calculating__choose-item_active');
    getStaticInf(activity, 'calculating__choose-item_active');
    getDynamicInf(dymanicElem);

    function getDynamicInf(elems) {
        elems.forEach((elem) =>{
            elem.addEventListener('input', (e) => {
                switch (e.target.getAttribute('id')) {
                    case 'height': 
                        height = +elem.value; 
                        break;
                    case 'weight': 
                        weight = +elem.value;
                        break;
                    case 'age':
                        age = +elem.value;     
                        break;    
                }
                calcResult();
            });
        });
        
    }
});