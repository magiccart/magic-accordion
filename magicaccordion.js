!(function($) {
     "use strict";
     $.fn.magicaccordion = function(options) {
         var defaults = {
             accordion: true,
             mouseType: false,
             speed: 300,
             closedSign: 'collapse',
             openedSign: 'expand',
             openedActive: false,
         };
         var opts = $.extend(defaults, options);
         var $this = $(this);
         if($this.hasClass('menu-init')) return;
         $this.addClass('menu-init')
         $this.find("li").each(function() {
             if ($(this).find("ul").size() != 0) {
                 $(this).find("ul").hide();
                 $(this).find("a:first").after("<span class='" + opts.closedSign + "'>" + opts.closedSign + "</span>");
                 if ($(this).find("a:first").attr('href') == "#") {
                     $(this).find("a:first").click(function() {
                         return false
                     })
                 }
             }
         });
         if (opts.openedActive) {
             $this.find("li.active").each(function() {
                 $(this).parents("ul").slideDown(opts.speed, opts.easing);
                 $(this).parents("ul").parent("li").find("a:first").next().html(opts.openedSign).removeClass(opts.closedSign).addClass(opts.openedSign);
                 $(this).find("ul:first").slideDown(opts.speed, opts.easing);
                 $(this).find("a:first").next().html(opts.openedSign).removeClass(opts.closedSign).addClass(opts.openedSign)
             })
         }
         if (opts.mouseType) {
             $this.find("li a").mouseenter(function() {
                 if ($(this).parent().find("ul").size() != 0) {
                     if (opts.accordion) {
                         if (!$(this).parent().find("ul").is(':visible')) {
                             var parents = $(this).parent().parents("ul");
                             var visible = $this.find("ul:visible");
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
                                         $(visible[visibleIndex]).slideUp(opts.speed, function() {
                                             $(this).parent("li").find("a:first").next().html(opts.closedSign).addClass(opts.closedSign)
                                         })
                                     }
                                 }
                             })
                         }
                     }
                     if ($(this).parent().find("ul:first").is(":visible")) {
                         $(this).parent().find("ul:first").slideUp(opts.speed, function() {
                             $(this).parent("li").find("a:first").next().delay(opts.speed + 1000).html(opts.closedSign).removeClass(opts.openedSign).addClass(opts.closedSign)
                         })
                     } else {
                         $(this).parent().find("ul:first").slideDown(opts.speed, function() {
                             $(this).parent("li").find("a:first").next().delay(opts.speed + 1000).html(opts.openedSign).removeClass(opts.closedSign).addClass(opts.openedSign)
                         })
                     }
                 }
             })
         } else {
             $this.find("li span").click(function() {
                 if ($(this).parent().find("ul").size() != 0) {
                     if (opts.accordion) {
                         if (!$(this).parent().find("ul").is(':visible')) {
                             var parents = $(this).parent().parents("ul");
                             var visible = $this.find("ul:visible");
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
                                         $(visible[visibleIndex]).slideUp(opts.speed, function() {
                                             $(this).parent("li").find("a:first").next().html(opts.closedSign).addClass(opts.closedSign)
                                         })
                                     }
                                 }
                             })
                         }
                     }
                     if ($(this).parent().find("ul:first").is(":visible")) {
                         $(this).parent().find("ul:first").slideUp(opts.speed, opts.easing, function() {
                             $(this).parent("li").find("a:first").next().delay(opts.speed + 1000).html(opts.closedSign).removeClass(opts.openedSign).addClass(opts.closedSign)
                         })
                     } else {
                         $(this).parent().find("ul:first").slideDown(opts.speed, opts.easing, function() {
                             $(this).parent("li").find("a:first").next().delay(opts.speed + 1000).html(opts.openedSign).removeClass(opts.closedSign).addClass(opts.openedSign)
                         })
                     }
                 }
             })
         }
         var catplus = $this.find('.nav-accordion >.level0:hidden').not('.all-cat');
         if (catplus.length) $this.find('.all-cat').show().click(function(event) {
             $(this).children().toggle();
             catplus.slideToggle('slow')
         });
         else $this.find('.all-cat').hide()
     }
 })(jQuery);