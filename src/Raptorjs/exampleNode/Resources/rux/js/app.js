/**
 * Main entrance
 *
 */
$(function() {
    Panel.RouterInstance = new Panel.Router();

    Panel.model = new Backbone.Model({
        extjs: false,
        content: ''
    });

    Panel.Ui.panelView = new Panel.Ui.BootstrapArea({
        model: Panel.model
    })

    Backbone.history.start();
    UIR.namespace('RUX');

    RUX.openUI = function(iframe,route) {
        if (iframe)
            Panel.RouterInstance.navigate('#!f' + route, {trigger: true})
        else
            Panel.RouterInstance.navigate('#!' + route, {trigger: true})
    };
});