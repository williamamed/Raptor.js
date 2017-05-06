UIR.Controller('RUX.Home', {
    elements: [{
            ref: '#rux-window',
            name: 'window'
        }, {
            ref: '#rux-window-frame',
            name: 'windowFrame'
        }, {
            ref: '#rux-window-cover',
            name: 'windowCover'
        }, {
            ref: '.function-profile',
            name: 'profileBtn'
        },{
            ref: '.function-home',
            name: 'homeBtn'
        },{
            ref: '#rux-indicator',
            name: 'pageLoad'
        }],
    onBack: function() {
        UIR.getController('RUX.Home').getWindow().empty();

        UIR.getController('RUX.Home').getWindowFrame().remove();
        UIR.getController('RUX.Home').getWindowCover().append('<iframe  id="rux-window-frame" style="width: 100%;height: 100%;border: none;" src=""></iframe>');

    },
    openFunction:function(frame,route){
        if(this.onRunning==true)
            return;
        var me=this;
        this.onBack();
        
        UIR.getController('RUX.Home').getWindowCover().hide();
        UIR.getController('RUX.Home').getWindow().hide();
        this.onRunning=true;
        if(frame){
            UIR.getController('RUX.Home').getWindowCover().show();
            UIR.getController('RUX.Home').getWindowFrame().attr('src',route);
            
            Pace.restart();
            UIR.getController('RUX.Home').getWindowFrame().load(function() {
               
               Pace.bar.finish(); 
               Pace.stop();
               me.onRunning=false; 
            })
        }else{
            UIR.getController('RUX.Home').getWindow().empty();
            UIR.getController('RUX.Home').getWindow().show();

            UIR.getController('RUX.Home').getWindow().load(route, function(r, status, xhr) {
                
                Pace.bar.finish(); 
                Pace.stop();
                me.onRunning=false;
                if (xhr.status === 401) {
                    window.location = 'dashboard';
                }
                
            });
        }
        
        $(window).scrollTop(0);
    },
    onLoad: function(el, e) {
        
        if ($(e.currentTarget).hasClass('bootstrap-ui')) {

            this.openFunction(false,'../' + $(e.currentTarget).attr('route').substring(1));
            
        } else {
             this.getWindowCover().attr('title',$(e.currentTarget).text())
            $('[data-toggle="tooltip"]').tooltip();
            this.openFunction(true,'../' + $(e.currentTarget).attr('route').substring(1));
           
        }
        
    },
    
    onProfile: function() {
        this.openFunction(false,'profile');
    },
    onHome: function() {

        this.openFunction(false,'raptor/description');

    },
    main: function() {

        var me = this;

        UIR.adjust = false;
        this.getWindowCover().height($(window).height()-130);
        
        
        this.getHomeBtn().click();
        $(window).on('resize',function(){
            me.getWindowCover().height($(window).height()-130);
        });
        
        UIR.namespace('RUX');
        RUX.openUI=$.proxy(this.openFunction,this);

    }
})
.Run(function() {
    this.addEvents({
        '.editing': {
            click: this.onEdit
        },
        '#tab-menu': {
            click: this.myLogo
        },
        '.rux-functions': {
            click: this.onLoad
        },
        '#my-logo': {
            click: this.onBack
        },
        '.sir-home': {
            click: function() {
                $('#my-logo').click()
            }
        },
        'body': {
            keyup: this.onCancelLoad
        },
        '#btnChangePass': {
            click: this.submit
        },
        '.function-profile': {
            click: this.onProfile
        },
        '.function-home': {
            click: this.onHome
        }
    });
    this.main();
})

