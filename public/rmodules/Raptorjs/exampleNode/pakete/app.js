/**
 * Main entrance
 *
 */
$(function() {
    Pakete.RouterInstance = new Pakete.Router();

    Pakete.model = new Backbone.Model({
        extjs: false,
        content: ''
    });

    Pakete.Ui.areaView = new Pakete.Ui.BootstrapArea({
        model: Pakete.model
    })

    Pakete.modelPakete = new Backbone.Model({
        extjs: false,
        content: ''
    });

    Pakete.Ui.paketeView = new Pakete.Ui.PaketeArea({
        model: Pakete.modelPakete
    })

    Pakete.Ui.profileView = new Pakete.Ui.Profile({
        model: new Backbone.Model({
            extjs: false,
            content: ''
        })
    })

    Pakete.Ui.CopiadoresView = new Pakete.Ui.Copiadores({
        model: new Backbone.Model({
            extjs: false,
            content: ''
        })
    })

    Backbone.history.start();




    Raptor.msg.bootstrap.info = function(text, floating, position, classStyle) {
        if (!classStyle) {
            classStyle = ''
        }
        if (true) {
            var msg = $('<div>');
            msg.addClass('alert alert-warning alert-dismissible raptor-msg-float ' + classStyle + ' fadeInDown');
            if (!position)
                msg.css({top: '0px'})
            else
                msg.css(position)
            msg.attr('role', 'alert');
            var btn = $('<span class="raptor-msg-closebtn pull-right" data-dismiss="alert" aria-hidden="true">&times;</span>');
            msg.append(btn)
            msg.append(text)
            msg.appendTo('body');
            setTimeout(function() {
                if (msg)
                    msg.fadeOut(function() {
                        msg.remove();
                    })

            }, 10 * 1000)
        }
    }
    Raptor.msg.bootstrap.error = function(text, floating, position, classStyle) {
        Raptor.msg.bootstrap.info(text, floating, position, classStyle ? classStyle : 'raptor-msg-red');
    }
});