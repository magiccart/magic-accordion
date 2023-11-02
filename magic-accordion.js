if (!customElements.get('magic-accordion')) {
    class MagicAccordion extends HTMLElement{
        constructor() {
            super();
            var $this = this;
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
                $this.initialized();
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
            var obj1 = Object.assign({}, object1),
                obj2 = Object.assign({}, object2);

            return Object.assign(obj1, obj2);
        }

        initialized() {
            var $this = this,
                self = $(this),
                options = this.datasetToObject(this.dataset) || {};
            this.settings = this.extend(this.defaults, options);
            options = this.settings;
            if(this.classList.contains('init')) return;
            this.classList.add('init');
            if(!options.leveltop){
                self.on('click', 'li.level0.hasChild a.level-top', function(e){
                    e.preventDefault();
                    $(this).siblings('.expand, .collapse').trigger('click');
                });
            }
            self.find("li").each(function() {
                if ($(this).find("ul").length) {
                    $(this).find("ul").hide();
                    $(this).find("a:first").after("<span class='" + options.closedSign + "'>" + options.closedSign + "</span>");
                }
            });
            if (options.openedActive) {
                $this.openedActive(self);
            }
            if (options.mouseType) {
                self.find("li a").mouseenter(function() {
                    $this.menuAction(self, $(this));
                });
            } else {
                self.find("li span").on('click', function() {
                    $this.menuAction(self, $(this));
                });
            }
            var catplus = self.find('.nav-accordion >.level0:hidden').not('.all-cat');
            if (catplus.length){
                self.find('.all-cat').show().on('click', function(event) {
                    $(this).children().toggle();
                    catplus.slideToggle('slow');
                });
            } else {
                self.find('.all-cat').hide();
            }
        }

        menuAction(self, item){
            var options = this.settings;
            var parent = item.parent();
            if (parent.find("ul").length) {
                if (options.accordion) {
                    if (!parent.find("ul").is(':visible')) {
                        var parents = parent.parents("ul");
                        var visible = self.find("ul:visible");
                        visible.each(function(visibleIndex) {
                            var close = true;
                            parents.each(function(parentIndex) {
                                if (parents[parentIndex] == visible[visibleIndex]) {
                                    close = false;
                                    return false
                                }
                            });
                            if (close) {
                                if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                    $(visible[visibleIndex]).slideUp(options.speed, function() {
                                        $(this).parent("li").find("a:first").next().html(options.closedSign).addClass(options.closedSign).removeClass(options.openedSign)
                                    })
                                }
                            }
                        });
                    }
                }
                var parentFirst = parent.find("ul:first");
                if (parentFirst.is(":visible")) {
                    parentFirst.slideUp(options.speed, function() {
                        $(this).parent("li").find("a:first").next().delay(options.speed + 1000).html(options.closedSign).removeClass(options.openedSign).addClass(options.closedSign)
                    });
                } else {
                    parentFirst.slideDown(options.speed, function() {
                        $(this).parent("li").find("a:first").next().delay(options.speed + 1000).html(options.openedSign).removeClass(options.closedSign).addClass(options.openedSign)
                    });
                }
            }
        }

        openedActive(self){
            var options = this.settings;
            self.find("li.active").each(function() {
                $(this).parents("ul").slideDown(options.speed, options.easing);
                $(this).parents("ul").parent("li").find("a:first").next().html(options.openedSign).removeClass(options.closedSign).addClass(options.openedSign);
                $(this).find("ul:first").slideDown(options.speed, options.easing);
                $(this).find("a:first").next().html(options.openedSign).removeClass(options.closedSign).addClass(options.openedSign)
            });
        }
    }

    customElements.define("magic-accordion", MagicAccordion);
}