/* ============================================================
 * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function ($) {
  "use strict";

  $.fn['bootstrapSwitch'] = function (method) {
    var methods = {
      init: function () {
        return this.each(function () {
            var $element = $(this)
              , $div
              , $switchLeft
              , $switchRight
              , $label
              , myClasses = ""
              , classes = $element.attr('class')
              , color
              , moving
              , onLabel = "ON"
              , offLabel = "OFF"
              , icon = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0)
                myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined)
              color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
              onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
              offLabel = $element.data('off-label');

            if ($element.data('icon') !== undefined)
              icon = $element.data('icon');

            $switchLeft = $('<span>')
              .addClass("switch-left")
              .addClass(myClasses)
              .addClass(color)
              .html(onLabel);

            color = '';
            if ($element.data('off') !== undefined)
              color = "switch-" + $element.data('off');

            $switchRight = $('<span>')
              .addClass("switch-right")
              .addClass(myClasses)
              .addClass(color)
              .html(offLabel);

            $label = $('<label>')
              .html("&nbsp;")
              .addClass(myClasses)
              .attr('for', $element.find('input').attr('id'));

            if (icon) {
              $label.html('<i class="icon icon-' + icon + '"></i>');
            }

            $div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false)
              $div.addClass('switch-animate').data('animated', true);

            $div
              .append($switchLeft)
              .append($label)
              .append($switchRight);

            $element.find('>div').addClass(
              $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
            );

            if ($element.find('input').is(':disabled'))
              $(this).addClass('deactivate');

            var changeStatus = function ($this) {
              $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find('input').on('change', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState)
                  $element.removeClass('switch-off').addClass('switch-on');
                else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false)
                  $element.addClass("switch-animate");

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;

              e.preventDefault();
              e.stopImmediatePropagation();

              $this.closest('div').removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate'))
                $this.unbind('click');
              else {
                $this.on('mousemove touchmove', function (e) {
                  var $element = $(this).closest('.switch')
                    , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                    , percent = (relativeX / $element.width()) * 100
                    , left = 25
                    , right = 75;

                  moving = true;

                  if (percent < left)
                    percent = left;
                  else if (percent > right)
                    percent = right;

                  $element.find('>div').css('left', (percent - right) + "%")
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this)
                    , $target = $(e.target)
                    , $myCheckBox = $target.siblings('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving)
                    $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                  else $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

                  moving = false;
                  $myCheckBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this)
                    , $myCheckBox = $this.siblings('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave');
                  $this.trigger('mouseup');

                  $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).unbind('mousemove');
                });
              }
            });
          }
        );
      },
      toggleActivation: function () {
        $(this).toggleClass('deactivate');
      },
      isActive: function () {
        return !$(this).hasClass('deactivate');
      },
      setActive: function (active) {
        if (active)
          $(this).removeClass('deactivate');
        else $(this).addClass('deactivate');
      },
      toggleState: function (skipOnChange) {
        var $input = $(this).find('input:checkbox');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      setState: function (value, skipOnChange) {
        $(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
      },
      status: function () {
        return $(this).find('input:checkbox').is(':checked');
      },
      destroy: function () {
        var $div = $(this).find('div')
          , $checkbox;

        $div.find(':not(input:checkbox)').remove();

        $checkbox = $div.children();
        $checkbox.unwrap().unwrap();

        $checkbox.unbind('change');

        return $checkbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);



(function($) {
    UIR.namespace('UIR.Components');
    UIR.Components.Switch = function(el, options) {
        this.options1 = options;
        this.element = el;
        this.init();

    }


    UIR.Components.Switch.prototype = {
        constructor: UIR.Components.Switch,
        init: function() {
			this.options={}
            $.extend(this.options,this.defaultOptions, this.options1);

            var $element = $(this.element);
            
            
            if($element.is('input[type="checkbox"]')){
                var inp=$element;
                $element=$('<div class="switch"></div>');
                $(this.element).after($element)
                $element.append(inp);
                this.element=$element;
            }
			
            if (this.options.name){
				console.debug(this.options,this.element)
                $element.find('input').attr('name', this.options.name);
            }else {
                if (!$element.find('input').attr('name'))
                    console.info("El componente Switch debe tener un name");
                else
                    this.options.name = $element.find('input').attr('name');
            }

            var color, $div
                    , $switchLeft
                    , $switchRight
                    , $label
                    , myClasses = ""
                    , classes = $element.attr('class')
                    , colorI
                    , colorD
                    , moving
                    , onLabel = this.options.labelOn
                    , offLabel = this.options.labelOff
                    , icon = false;

            if (this.options.typeOn)
                colorI = "switch-" + this.options.typeOn;
            if (this.options.typeOff)
                colorD = "switch-" + this.options.typeOff;

            $element.addClass('has-switch');
            if ($element.data('on') !== undefined)
                colorI = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
                onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
                offLabel = $element.data('off-label');

            if ($element.data('icon') !== undefined)
                icon = $element.data('icon');


            $switchLeft = $('<span>')
                    .addClass("switch-left")
                    .addClass(myClasses)
                    .addClass(colorI)
                    .html(onLabel);


            if ($element.data('off') !== undefined)
                colorD = "switch-" + $element.data('off');

            $switchRight = $('<span>')
                    .addClass("switch-right")
                    .addClass(myClasses)
                    .addClass(colorD)
                    .html(offLabel);

            $label = $('<label>')
                    .html("&nbsp;")
                    .addClass(myClasses)
                    .attr('for', $element.find('input').attr('id'));

            if (icon) {
                $label.html('<i class="icon icon-' + icon + '"></i>');
            }

            $div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false)
                $div.addClass('switch-animate').data('animated', true);

            $div
                    .append($switchLeft)
                    .append($label)
                    .append($switchRight);

            $element.find('>div').addClass(
                    $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
                    );

            if ($element.find('input').is(':disabled'))
                $(this.element).addClass('deactivate');

            var changeStatus = function($this) {
                $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');

            };

            $switchLeft.on('click', function(e) {
                changeStatus($(this));

            });

            $switchRight.on('click', function(e) {
                changeStatus($(this));

            });

            $element.find('input').on('change', function(e, skipOnChange) {
                var $this = $(this)
                        , $element = $this.parent()
                        , thisState = $this.is(':checked')
                        , state = $element.is('.switch-off');

                e.preventDefault();

                $element.css('left', '');

                if (state === thisState) {

                    if (thisState)
                        $element.removeClass('switch-off').addClass('switch-on');
                    else
                        $element.removeClass('switch-on').addClass('switch-off');

                    if ($element.data('animated') !== false)
                        $element.addClass("switch-animate");

                    if (typeof skipOnChange === 'boolean' && skipOnChange)
                        return;

                    $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
                }
            });

            $element.find('label').on('mousedown touchstart', function(e) {
                var $this = $(this);
                moving = false;

                e.preventDefault();
                e.stopImmediatePropagation();

                $this.closest('div').removeClass('switch-animate');

                if ($this.closest('.has-switch').is('.deactivate'))
                    $this.unbind('click');
                else {


                    $this.on('click touchend', function(e) {
                        var $this = $(this)
                                , $target = $(e.target)
                                , $myCheckBox = $target.siblings('input');

                        e.stopImmediatePropagation();
                        e.preventDefault();

                        $this.unbind('mouseleave');

                        if (moving)
                            $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                        else
                            $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

                        moving = false;
                        $myCheckBox.trigger('change');
                    });

                    $this.on('mouseleave', function(e) {
                        var $this = $(this)
                                , $myCheckBox = $this.siblings('input');

                        e.preventDefault();
                        e.stopImmediatePropagation();

                        $this.unbind('mouseleave');
                        $this.trigger('mouseup');

                        $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                    });

                    $this.on('mouseup', function(e) {
                        e.stopImmediatePropagation();
                        e.preventDefault();

                        $(this).unbind('mousemove');
                    });
                }
            });
           
            this.messageInvalid();
            this.markValid();
            var that = this;
            $(this.element).find('input').change(function() {
                

            })

        },
        defaultOptions: {
            labelOff: 'OFF',
            labelOn: 'On'

        },
        validate: function() {
            
            if ($(this.element).find('input[required][type="checkbox"]').size()>0) {

                if (!this.status()) {

                    this.markInvalid();

                    return false
                } else {
                    this.markValid();

                    return true
                }

            } else {
                this.markValid();
                return true
            }
        },
        setRequired: function() {
            this.required = true;

        },
        reset:function(){
            $(this.element).removeClass('error');
            $(this.element).prop('checked', false).trigger('change', false);
        },
        setValue:function(val){
            $(this.element).find('input:checkbox').prop('checked', val).trigger('change', val);
        },
        getValue:function(){
            return this.status();
        },
        markInvalid: function() {
            this.invalidField = true;
            $(this.element).addClass('error')

        },
        markValid: function() {
            this.invalidField = false;
            $(this.element).removeClass('error')
        },
        messageInvalid: function() {
            

      },
        
        isActive: function() {
            return !$(this.element).hasClass('deactivate');
        },
        setActive: function(active) {
            if (active)
                $(this.element).removeClass('deactivate');
            else
                $(this.element).addClass('deactivate');
        },
        setState: function(value, skipOnChange) {
            $(this.element).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
        },
        toggleState: function(skipOnChange) {
            var $input = $(this.element).find('input:checkbox');
            $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
        },
        status: function() {
            return $(this.element).find('input:checkbox').is(':checked');
        },
        destroy: function() {
            var $div = $(this.element).find('div')
                    , $checkbox;

            $div.find(':not(input:checkbox)').remove();

            $checkbox = $div.children();
            $checkbox.unwrap().unwrap();

            $checkbox.unbind('change');

            return $checkbox;
        },
    }


    $.fn.switchUIR = function(options) {
        if (typeof options === 'string') {
            if(options === 'data')
                return $(this).data('switchuir');
            var obj=$(this).data('switchuir');
            
            var arg=new Array();
            for(var i=1;i<arguments.length;i++){
                arg.push(arguments[i])
            }
            if(obj[options])
                return obj[options].apply(obj, arg);
        } else
            $(this).each(function() {
                var sw = new UIR.Components.Switch(this, options);
                $(this).data('switchuir', sw);
                $(this).find('input').data('switchuir', sw);

            })

    }





})(jQuery);
