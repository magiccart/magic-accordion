if (!customElements.get('magic-accordion')) {
    class MagicAccordion extends HTMLElement{
        constructor() {
            super();
            var self = this;
            this.defaults = {
                accordion: true,
                mouseType: false,
                leveltop: true,
                speed: 300,
                closedSign: 'collapse',
                openedSign: 'expand',
                openedActive: false,
             };
            this.settings = {};
            document.addEventListener("MagicAccordion", function (event) {
                self.initialized();
            });
        }

        connectedCallback() {
            if(!this.classList.contains('ajax')) this.initialized();
        }
        datasetToObject(dataset) {
            var object = Object.assign({}, dataset);
            for (var property in object) {
            var value = object[property];
            switch(value) {
                case null:
                    value = null;
                    break;
                case false:
                    value = false;
                    break;
                case true:
                    value = true;
                    break;
                case !isNaN(value):
                    value = Number(value);
                    break;
                default:
                    try {
                      value = JSON.parse(value);
                    } catch (e) {
                      // value = value;
                    }
                    try {
                      value = (0, eval)('(' + value + ')');
                    } catch (e) {
                      value = value;
                    }
            }
            object[property] = value;
            }
            return object;
        }
        extend(object1, object2){
            let obj = Object.assign({}, object1);
            return Object.assign(obj, object2);
        }
        addEventListener(events, selector, fn){
            events = events.split(",").map((e) => e.trim());
            this.querySelectorAll(selector).forEach(element => {
                events.forEach(event => {
                    element.addEventListener(event, fn.bind(element));
                })
            });
        }
        getSibling(element){
            let siblings = [];
            for (let sibling of element.parentNode.children) {
                if (sibling !== element) siblings.push(sibling);
            }
            return siblings;
        }
        parents(selector, element) {
            if((element instanceof NodeList)){
                var parents  =  Array.from(element).map((item) => item.closest(selector))
                .filter((el, index, array) => {
                    /* remove null value */
                    return el ? array.indexOf(el) === index : false;
                });
                return parents;
            }else {
                var closest = element.closest(selector);
                return closest ? [closest] : [];
            }
        }
        slideUp(target, duration=500) {
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout( () => {
              target.style.display = 'none';
              target.style.removeProperty('height');
              target.style.removeProperty('padding-top');
              target.style.removeProperty('padding-bottom');
              target.style.removeProperty('margin-top');
              target.style.removeProperty('margin-bottom');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              target.classList.remove('down');
            }, duration);
        }
        slideDown(target, duration=500) {
            target.style.removeProperty('display');
            let display = window.getComputedStyle(target).display;

            if (display === 'none')
                display = 'block';
            target.style.display = display;
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout( () => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.add('down');
            }, duration);
        }
        slideToggle(target, duration = 500) {
            if (window.getComputedStyle(target).display === 'none') {
                return slideDown(target, duration);
            } else {
                return slideUp(target, duration);
            }
        }
        initialized() {
            var self = this,
                options = this.datasetToObject(this.dataset) || {};
            this.settings = this.extend(this.defaults, options);
            options = this.settings;
            if(this.classList.contains('init')) return;
            this.classList.add('init');
            if(!options.leveltop){
                self.addEventListener('click', 'li.level0.hasChild a.level-top', function(e){
                    e.preventDefault();
                    self.getSibling(this).filter(element => element.matches('.arrow')).forEach(element =>{
                        element.click();
                    })
                });
            }
            self.querySelectorAll("li").forEach( element => {
                let ul = element.querySelectorAll('ul');
                if(ul.length){
                    ul.forEach(el => {
                        // el.style.display = 'none';
                    });
                    let a = element.querySelector('a');
                    if(a) a.insertAdjacentHTML("afterend", `<span class="arrow ${options.closedSign}">${options.closedSign}</p>`);
                }
            });
            if (options.openedActive) {
                self.openedAllActive();
            }
            if (options.mouseType) {
                self.addEventListener('mouseenter', 'li a', function(e){
                    self.menuAction(this);
                });
            } else {
                self.addEventListener('click', 'li .arrow', function(e){
                    self.menuAction(this);
                });
            }
        }

        menuAction(item){
            var self = this,
                options = this.settings,
                parent = item.closest('li'),
                parentUl = parent.querySelectorAll('ul');
            if (parentUl.length) {
                if (options.accordion) {
                    var parentFirst = parent.querySelector("ul"),
                        parents = self.parents('ul', parent),
                        visible = Array.from(self.querySelectorAll("ul")).filter(element => element.classList.contains('down'));
                    visible.forEach(function(element, visibleIndex) {
                        if(element == parentFirst) return;
                        var close = true;
                        parents.some(function(el, parentIndex) {
                            if (parents[parentIndex] == visible[visibleIndex]) {
                                close = false;
                                return false
                            }
                            return true;
                        });
                        if (close) {
                            self.slideUp(element, options.speed);
                            self.clossedActive(element);
                        }
                    });
                }
                if (parentFirst.classList.contains('down')) {
                    self.slideUp(parentFirst, options.speed);
                    self.clossedActive(parentFirst);
                } else {
                    self.slideDown(parentFirst, options.speed);
                    self.openedActive(parentFirst);
                }
            }
        }
        clossedActive(element){
            var options = this.settings,
                arrow = element.closest("li").querySelector("a").nextElementSibling;
            arrow.classList.add(options.closedSign);
            arrow.classList.remove(options.openedSign);
            arrow.textContent = options.closedSign;
        }
        openedActive(element){
            var options = this.settings,
                arrow = element.closest("li").querySelector("a").nextElementSibling;
            arrow.classList.add(options.openedSign);
            arrow.classList.remove(options.closedSign);
            arrow.textContent = options.openedSign;
        }
        openedAllActive(){
            var options = this.settings;
            this.querySelectorAll("li.active").forEach( element => {
                self.parents('ul', element).forEach(ul =>{
                    self.slideDown(ul, options.speed);
                    self.openedActive(ul);
                });
                self.slideDown(element.querySelector('ul'), options.speed);
                self.openedActive(element);
            });
        }
    }

    customElements.define("magic-accordion", MagicAccordion);
}