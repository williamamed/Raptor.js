Ext.define('Auditories.model.EstadisticModel', {
    extend: 'Ext.data.Model',
    fields: ['cant','name','color','percent'],
    
    proxy: {
        type: 'ajax',
        url:'auditories/listestadistic',
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json'
        }
    }
});
Ext.define('Auditories.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','a_date','log','username','ip','state'],
    
    proxy: {
        type: 'ajax',
        api:{
            create  : 'auditories/insert',
            read    : 'auditories/list',
            update  : 'action/edit',
            destroy : 'action/delete'
        },
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success', 
            totalProperty: 'result'
           
        }
    }
});
Ext.define('Auditories.store.Estadistic', {
    extend: 'Ext.data.Store',
    model: 'Auditories.model.EstadisticModel'
});
Ext.define('Auditories.store.Generic', {
    extend: 'Ext.data.Store',
    model: 'Auditories.model.GenericModel'
});
 Ext.define('Auditories.view.AutChart',{
        extend:'Ext.chart.Chart',
        alias: 'widget.autchart',
         background: {
                fill: 'rgb(255, 255, 255)'
            },
        animate: true,
            shadow: true,
            store: 'Estadistic',
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['percent'],
                title: Raptor.getTag('trace_percent'),
                grid: true,
                minimum: 0,
                maximum:100
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: Raptor.getTag('state')
                
            }],
            series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'name',
                yField: ['percent'],
                tips: {
                    trackMouse: true,
                    width: 74,
                    height: 38,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('name'));
                        this.update(storeItem.get('cant'));
                    }
                },
                renderer: function(sprite, storeItem, barAttr, i, store) {
                    barAttr.fill = storeItem.get('color');
                    return barAttr;
                }
            }],
        initComponent:function(){
          
            
        this.buttons = [
                        {
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



 Ext.define('Auditories.view.ChartWindow',{
        extend:'Ext.Window',
        width: 800,
        height: 500,
        modal:true,
        alias: 'widget.chartwindow',
        autoShow: true,
        iconCls:'icon-grafica',
        closeAction:'destroy',
        title: Raptor.getTag('chart'),
        layout:'fit',
        initComponent:function(){
            this.items = [{
                xtype:'autchart'
            }]
            
        this.buttons = [{
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



Ext.define('Auditories.view.GenericList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.genericlist',
    selType:'checkboxmodel',
    store: 'Generic',
    title: Raptor.getTag('aud_header'),
    iconCls:'',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('username'),
            dataIndex: 'username',
            flex: 1
        },{
            header:Raptor.getTag('state'),
            dataIndex: 'state',
            renderer:function(val,meta){
                meta.style='font: bold 11 Lucida Grande, Tahoma, sans-serif;';
                switch (val){
                    case 1:
                        meta.style+='color:#B30606';
                        return 'EMERGENCY';
                    case 2:
                        meta.style+='color:#D4A007';
                        return 'ALERT';
                    case 3:
                        meta.style+='color:#B30606';
                        return 'CRITICAL';
                    case 4:
                        meta.style+='color:#B30606';
                        return 'ERROR';
                    case 5:
                        meta.style+='color:#D4A007';
                        return 'WARN';
                    case 6:
                        meta.style+='color:#12048F';
                        return 'NOTICE';
                    case 7:
                        meta.style+='color:#069407';
                        return 'INFO';
                    case 8:
                        meta.style='color:#D4A007';
                        return 'DEBUG';
                }
            },
            flex: 1
        },{
            header:Raptor.getTag('route'),
            dataIndex: 'log',
            
            flex: 4
        },{
            header:Raptor.getTag('ip'),
            dataIndex: 'ip',
            flex: 1
        },{
            header:Raptor.getTag('date'),
            dataIndex: 'a_date',
            renderer:function(value){
                return Ext.Date.parse(value.replace('Z',''),'c')
            },
            flex: 1
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            
            
            items: [{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                disabled:true,
                
                privilegeName:'delete',
                action:'delete',
                iconCls:'icon-del'  
            },{
                xtype: 'button',
                text: Raptor.getTag('export'),
                disabled:false,
                
                privilegeName:'export',
                action:'export',
                iconCls:'icon-export'  
            },{
                xtype: 'button',
                text: Raptor.getTag('chart'),
                action:'grafic',
                iconCls:'icon-grafica'  
            },{
                xtype: 'button',
                text: Raptor.getTag('search'),
                disabled:false,
                
                //privilegeName:'search',
                action:'search',
                iconCls:'icon-search'  
            },{
                xtype: 'button',
                text: Raptor.getTag('details'),
                disabled:true,
                
                //privilegeName:'search',
                action:'see',
                iconCls:'icon-detalles'  
            }]
        }];
        this.bbar=Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true
            
            
        });
        this.callParent();
    }
});


 Ext.define('Auditories.view.GenericSee',{
        extend:'Ext.Window',
        width:600,
        height:400,
        bodyStyle:'overflow:scroll;background:black;color:white;padding:5px;',
        modal:true,
        alias: 'widget.genericsee',
        autoShow: true,
        iconCls:'icon-detalles',
        closeAction:'destroy',
        title: '',
        layout:'fit',
        initComponent:function(){
           
            this.callParent();
           
        } 
 
      
    })



 Ext.define('Auditories.view.GenericWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        iconCls:'icon-search',
        closeAction:'destroy',
        title: Raptor.getTag('searchheader'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            frame: true,
            xtype: 'form',
            layout: 'anchor',
            bodyStyle: 'padding:5px 5px 5px 5px',
            defaults: {frame: true, anchor: '100%'},
            items: [{
                            xtype: 'textfield',
                            fieldLabel: Raptor.getTag('username'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'username'
                            
                        },{
                            xtype: 'textfield',
                            fieldLabel:Raptor.getTag('route'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'log'
                            
                        },{
                            xtype: 'textfield',
                            fieldLabel:Raptor.getTag('ip'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'ip'
                            
                        },{
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: Raptor.getTag('range_from'),
                            labelAlign: 'top',
                            format:'Y-m-d',
                            name: 'from_date'
                        }, {
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: Raptor.getTag('range_to'),
                            format:'Y-m-d',
                            labelAlign: 'top',
                            name: 'to_date'
                            
                        }]
        };
            
        this.buttons = [{   iconCls: 'icon-search',
                            text: Raptor.getTag('search'),
                            action: 'save'
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



Ext.define('Auditories.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'genericlist',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});
Ext.define('Auditories.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic','Estadistic'],
    models: ['GenericModel'],
    refs: [{
            ref: 'genericlist',
            selector: 'genericlist'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=addAction]'
        },
        {
            ref: 'buttonEdit',
            selector: 'viewport button[action=editAction]'
        },
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=delete]'
        },{
            ref: 'buttonSee',
            selector: 'viewport button[action=see]'
        }
    ],
    init: function() {
        this.control({
            
            'genericwindow button[action=save]': {
                click: this.search
            },
            'viewport button[action=export]': {
                click: this.onExport
            },
            'viewport button[action=delete]': {
                click: this.onDelete
            },
            'viewport button[action=search]': {
                click: this.onSearch
            },
            'viewport button[action=grafic]': {
                click: this.onGrafic
            },
            'viewport button[action=see]': {
                click: this.onSee
            },
            'genericlist': {
                beforeselect: this.onListSelect,
                deselect: this.onListDeSelect
                
            },
            
            'viewport':{
                render:this.onRender
            }
        });
       
    },
    onRender:function(){
        //Make Raptor control the UI to activate the privilege
        //Raptor.controlActions();
        //console.debug();
        this.getGenericStore().load();
        Raptor.secureTroodon()
        
    },
    onGrafic:function(){
        this.getEstadisticStore().load();
        var view = Ext.widget('chartwindow');
    },
    onExport:function(){
        var start=(this.getGenericStore().currentPage-1)*25;
        var ventana = window.open('auditories/export?data&start='+start+'&limit=25&page='+this.getGenericStore().currentPage,'');
    },
    onSearch:function(){
        var view = Ext.widget('genericwindow');
    },
    onSee:function(){
        var view = Ext.widget('genericsee',{html:'<pre>'+this.getGenericlist().getSelectionModel().getLastSelected().get('log')+'</pre>'});
    },
    search:function(button){
        var win=button.up('window');
        this.getGenericStore().getProxy().extraParams={
            username: win.down('textfield[name=username]').getValue(),
            ip:win.down('textfield[name=ip]').getValue(),
            log:win.down('textfield[name=log]').getValue(),
            from_date:win.down('datefield[name=from_date]').getValue(),
            to_date:win.down('datefield[name=to_date]').getValue()
        }
        this.getGenericStore().loadPage(1);
        win.close();
    },        
    
    onListSelect: function() {
       this.getButtonDelete().setDisabled(false);
       this.getButtonSee().setDisabled(false); 
    },
    onListDeSelect: function() {
       
       if(this.getGenericlist().getSelectionModel().getSelection().length===0) {
           this.getButtonDelete().setDisabled(true);
           this.getButtonSee().setDisabled(true); 
       }
      
    },
   
    onAddAction: function() {
        var view = Ext.widget('genericwindow');
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDelete: function() {
       Raptor.msg.show(2,Raptor.getTag('msgdeletemulti'), this.deleteAction, this);
    },
    
    addAction:function(button){
        var win=button.up('window');
       
        if(win.action=='edit'){
            this.update(win.down('form'),'action/edit');
        }else{
            this.insert(win.down('form'),'action/insert');
        }
    },
    
    insert:function(form,url){
        form.submit({
            url: url,
            waitMsg: 'wait please..',
            params:{},
            success: function(formBasic, action) {
                form.up('window').close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getGenericlist().getStore().load();
                
            },
            failure: function(formBasic, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(1, Raptor.getTag('invalidform'));
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Raptor.msg.show(3, 'Ajax communication failed');
                        break;
                }

                if (action.result && action.result.code) {
                    Raptor.msg.show(action.result.code, action.result.msg);
                }
               
            },
            scope: this
        });
    },
    update:function(form,url){
        var idaction=this.getGenericlist().getSelectionModel().getLastSelected().get('id');
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{idaction: idaction},
            success: function(formBasic, action) {
                form.up('window').close();
                this.getGenericlist().getSelectionModel().deselectAll();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getGenericlist().getStore().load();
                
            },
            failure: function(formBasic, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(1, Raptor.getTag('invalidform'));
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Raptor.msg.show(3, 'Ajax communication failed');
                        break;
                }

                if (action.result && action.result.code) {
                    Raptor.msg.show(action.result.code, action.result.msg);
                }
               
            },
            scope: this
        });
    },
    
    
    deleteAction: function() {
        var model=this.getGenericlist().getSelectionModel().getSelection();
        var count=model.length;
        var listdelete=new Array();
        for (var i=0;i<count;++i){
            listdelete.push(model[i].get('id'))
        }
        
        var wait=Raptor.msg.show(4,'wait please..');
        Ext.Ajax.request({
            url: 'auditories/delete',
            params:{ids: Ext.encode(listdelete)},
            callback: function() {
                wait.close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if(obj.code&&obj.code==1){
                    this.getGenericlist().getStore().load();
                }
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       
      
    }

});


/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Auditories',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','EstadisticModel'],    
    stores: ['Generic','Estadistic'],
    controllers: ['Generic']
});

