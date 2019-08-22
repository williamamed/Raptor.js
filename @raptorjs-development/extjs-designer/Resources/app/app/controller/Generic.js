Ext.define('Generate.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic','GenericTreeStore','AttrCombo'],
    models: ['GenericModel'],
    refs: [{
            ref: 'generictree',
            selector: 'generictree'
        },{
            ref: 'buttonDelete',
            selector: 'generictree button[action=deleteAction]'
        },
        {
            ref: 'genericlist',
            selector: 'genericlist'
        },{
            ref:'atributos',
            selector:'atributos'
        },{
            ref:'componentes',
            selector:'componentes'
        },{
            ref:'fileButton',
            selector:'filewindow button[action=openFile]'
        }
    ],
    init: function() {
        this.control({
            'genericlist #renderPanel':{
                render: this.onAreaRender
            },
            'atributos':{
                edit: this.onEditAttr,
                beforeedit: this.onBeforeEdtAttr,
                deleteattrUI:this.onDeleteAttr,
                editattrUI:this.onWindowAttr
            },
            'atributos button[action=addAction]':{
                click: this.onAddAttr
            },
            'componentes':{
                render: this.onComponentesLoad
            },
            'generictree button[action=deleteAction]':{
                click: this.onDeleteCmp
            },
            'generictree button[action=genAction]':{
                click: this.onGenerate 
            },
            'controllerwindow button[action=save]': {
                click: this.newControllerAction
            },
            'generictree': {
                beforeselect: this.onTreeSelect,
                select: this.onComboPropertyExpand 
            },
            'genericwindow button[action=save]': {
                click: this.onEditAreaAttr,
            },
            'filewindow button[action=openFile]': {
                click: this.onOpenFile,
            },
            'filewindow filetree': {
                select: this.onTreeFileSelect,
            },
            'viewport':{
                render:this.onRender,
                afterrender:this.afterRender
            }
        });
       
    },

    onTreeFileSelect:function($this,record){
        
        if(record.get('isView')){
            this.getFileButton().setDisabled(false)
        }else{
            this.getFileButton().setDisabled(true)
        }
    },

    onOpenFile:function(btn){
        var config=btn.up('window').down('treepanel').getSelectionModel().getLastSelected().get('confUI')
        var meta=btn.up('window').down('treepanel').getSelectionModel().getLastSelected().get('meta')
        if(config){
            this.prefixName=config.name;
            this.isNew=true;
        }
        if(meta){
            this.prefixName=meta.conf.prefixName;
            this.openUi(meta)
        }else{
            
        }
        this.extAppFile=btn.up('window').down('treepanel').getSelectionModel().getLastSelected().get('id')
        this.getGenericlist().setTitle("Vista previa - "+this.extAppFile)
        btn.up('window').close()

    },
    onDeleteCmp:function(){
        var model=this.getGenerictree().getSelectionModel().getLastSelected()
        var parent=model.parentNode;
        
        if(!model.isRoot()){
            var ref=this.getGenericlist().down('#'+model.get('uiid'));
            var parentCmp=ref.ownerCt;
            
            parentCmp.remove(ref,true)
            model.remove()
            this.getButtonDelete().disable();
            this.getAtributos().getStore().removeAll()
        }
    },
    
    onComboPropertyExpand:function(){
        this.getAttrComboStore().loadData([])
        var type=this.getGenerictree().getSelectionModel().getLastSelected().get('text')
        var me=this;
        Ext.data.JsonP.request({
            callbackName : type.replace(/\./g , "_"),
            url : Raptor.public('extjs-designer/app/api/'+type+'.js'),
            callback:function(a,data){
                var cfg=data.members.cfg;
                
                me.getAttrComboStore().loadData(cfg)
            }
          })
    },
    
    onAddAttr:function(){
       
        var r={name:'',value:''};
        this.getAtributos().getStore().add(r);
    },
    idgen:1,
    
    onAreaRender:function(v){
        
        var me=this;
        
        v.getEl().on('click',function(e){
            e.stopPropagation()
            var $controller=Generate.getApplication().getController('Generic');
            
            var finded=$controller.getGenerictree().getRootNode().findChildBy(function(node){
                
                if(node.get('sample').itemId===v.getItemId()){
                    return true;
                }
                    
            },this,true)
            if(finded!=null){
                $controller.getGenerictree().getSelectionModel().select(finded)
            }
        })
        
        v.dropZone = new Ext.dd.DropZone(v.getEl().dom, {
            ddGroup: 'TreeDD',
            // If the mouse is over a grid row, return that node. This is
            // provided as the "target" parameter in all "onNodeXXXX" node event handling functions
            getTargetFromEvent: function(e) {
                var childs=v.query('container')
                for (var i = childs.length-1;i >= 0; i-- ) {
                     if(childs[i].getEl()&&e.getTarget('#'+childs[i].getEl().id))
                        return childs[i];
                }
                return v; 
            },
    
            // On entry into a target node, highlight that node.
            onNodeEnter : function(target, dd, e, data){
                Ext.fly(target.getEl()).addCls('comp-drag-designer');
                
                if(target.body)
                    target.body.highlight();
                else
                    target.getEl().highlight();
            },
    
            // On exit from a target node, unhighlight that node.
            onNodeOut : function(target, dd, e, data){
               // Ext.fly(target).removeCls('my-row-highlight-class');
               if(target.getEl())
               Ext.fly(target.getEl()).removeCls('comp-drag-designer');
            },
    
            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver : function(target, dd, e, data){
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
    
            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            // In this case, it is a Record in the GridPanel's Store.
            // We can use the data set up by the DragZone's getDragData method to read
            // any data we decided to attach in the DragZone's getDragData method.
            onNodeDrop : function(target, dd, e, data){
                var element=data.records[0];
                var def=Ext.clone(element.get('sample'));
                var extra=Ext.clone(element.get('sample'));
                if(element.get('layout')){
                    if(target.removeAll)
                        var items=target.removeAll(false);
                    for (var i = 0; i < items.length; i++) {
                        items[i].applyState(element.get('sample'))
                        Ext.apply(items[i].initialConfig,element.get('sample'))
                        var finded=me.getGenerictree().getRootNode().findChildBy(function(node){
                        
                            if(node.get('sample').itemId===items[i].getItemId()){
                                return true;
                            }
                                
                        },this,true)
                        
                        if(finded!=null){
                            var mod=Ext.clone(finded.get('sample'))
                            finded.set('sample',Ext.apply(mod,element.get('sample')))
                        }
                    }
                    var parent=target.up('container');
                    var index=parent.items.indexOf(target);
                    parent.remove(target,true)
                    
                    var cmp=target.cloneConfig({
                        layout: element.get('definition'),
                        items:[]
                    });
                    parent.insert(index,cmp)
                    cmp.add(items)
                    var finded=me.getGenerictree().getRootNode().findChildBy(function(node){
                    
                        if(node.get('sample').itemId===target.getItemId()){
                            return true;
                        }
                            
                    },this,true)
                    
                    if(finded!=null){
                        var mod=Ext.clone(finded.get('sample'))
                        mod.layout=element.get('definition')
                        finded.set('sample',mod)
                    }
                    return true;
                }
                
                def.itemId=me.prefixName+(me.idgen++);
                extra.itemId=def.itemId
                
                def.listeners={
                    render: me.onAreaRender
                }
                var cmpName=element.get('simulate')?element.get('simulate'):element.get('definition');
                if(element.get('simulateSample'))
                    Ext.apply(def,Ext.clone(element.get('simulateSample')))
                var cmp=Ext.create(element.get('definition'),def);
                
                target.add(cmp)
                var finded=me.getGenerictree().getRootNode().findChildBy(function(node){
                    
                    if(node.get('sample').itemId===target.getItemId()){
                        return true;
                    }
                        
                },this,true)
                if(finded==null){
                    extra.defineName=me.prefixName
                    me.getGenerictree().getRootNode().appendChild({
                        text: cmpName,
                        sample:extra,
                        uiid: cmp.getItemId()
                    })
                    me.getGenerictree().getRootNode().expand()
                }else{
                   finded.appendChild({
                        text: cmpName,
                        sample: extra,
                        uiid: cmp.getItemId()
                    }) 
                    finded.expand()
                }
                return true;
            }
        });
    },
    
    recursiveTree:function(parent){
        var items=[]
        for (var i = 0; i < parent.childNodes.length; i++) {
            var item=Ext.clone(parent.childNodes[i].getData())
            
            if(parent.childNodes[i].hasChildNodes())
                item.children=this.recursiveTree(parent.childNodes[i])
            items.push(item)
        }
        return items;
    },
    activeStores:[],
    recursiveGenerate:function(parent){
        var obj=Ext.merge({},parent.initialConfig);
        var finded=this.getGenerictree().getRootNode().findChildBy(function(node){
            
            if(node.get('sample').itemId===parent.getItemId()){
                return true;
            }
                
        },this,true)
        if(finded!=null)
           obj=Ext.clone(finded.get('sample'))
        if(parent.getStore){
            this.activeStores.push({
                name: obj.store,
                type: parent.getStore()['$className']
            })
        }
        
        /**if(obj.store){
            obj.store=obj.store.storeName
        }*/
        delete obj.id
        delete obj.listeners
        if(parent.items && parent.xtype!=='treepanel' && parent.xtype!=='gridpanel' && parent.xtype!=='htmleditor' ){
            obj.items=[]
            
            for (var i = 0; i < parent.items.length; i++) {
                
                obj.items.push(this.recursiveGenerate(parent.items.getAt(i)))
            }
            if(obj.items.length==0)
                delete obj.items
        }
        
        return obj;
    },
    
    onGenerate:function(){
        
        var root=this.getGenericlist().down('#'+this.getGenerictree().getRootNode().getChildAt(0).get('uiid'))
        var base=this.getGenerictree().getRootNode().getChildAt(0).get('text')
        var tree=this.recursiveTree(this.getGenerictree().getRootNode());
        this.activeStores=[]
        Ext.Ajax.request({
            url: 'designer/save',
            params: {
                _csrf: Raptor.getCsrfToken(),
                app: this.extAppFile,
                ui: JSON.stringify(this.recursiveGenerate(root)),
                tree: JSON.stringify(tree),
                store: JSON.stringify(this.activeStores),
                conf: JSON.stringify({
                    prefixName: this.prefixName,
                    base: tree[0].text
                }),
                idgen: this.idgen,
                isNew: this.isNew
            },
            callback: function () {
                
            },
            success: function (response, opts) {
                Raptor.msg.show(1, JSON.parse(response.responseText).src);
                
            },
            failure: function (response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });
        /**require('electron').ipcRenderer.send('extjs-plugin:save-ui',{
            ui: this.recursiveGenerate(root),
            tree: this.recursiveTree(this.getGenerictree().getRootNode()),
            idgen: this.idgen,
            config: this.configUi,
            base: base,
            defineName: this.getGenerictree().getRootNode().getChildAt(0).get('sample').defineName
        },this.metadataUi.defineName)*/
        //console.log(this.recursiveGenerate(root),this.recursiveTree(this.getGenerictree().getRootNode()))
        //console.log('change',this.tabid,this.getGenerictree().getRootNode().getChildAt(0).get('sample').defineName)
        //require('electron').ipcRenderer.send('extjs:changename',this.tabid,this.getGenerictree().getRootNode().getChildAt(0).get('sample').defineName)
        
        //this.metadataUi.defineName=this.getGenerictree().getRootNode().getChildAt(0).get('sample').defineName
        //var name=this.getGenerictree().getRootNode().getChildAt(0).get('sample').defineName;
        //Ext.Msg.alert('Ui', 'El componente "'+this.configUi.appName+'.view.'+name+'" fue generado en el directorio "'+this.configUi.dirName+'" de la aplicación con el nombre "'+name+'.js"');
    },
    onBeforeEdtAttr:function(editor,e){
        if(e.record.get('name')=='xtype')
            return false;
    },
    onEditAttr:function(editor, e){
        if(e.record.get('name')=='itemId' && !e.record.get('value'))
            return false;
        
        if(!e.record.get('name'))
            return false;
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        var conf=Ext.clone(model.get('sample'))
        //conf[e.record.get('name')]=e.record.get('value')
        var value=e.record.get('value');
        try {
            value=Ext.decode(value)
        } catch (ex) {
            value=e.record.get('value')
        }
        
        conf[e.record.get('name')]=Ext.isNumeric(value)?parseInt(value):value
        
        model.set('sample',conf)
        //Ext.apply(this.getGenerictree().getSelectionModel().getLastSelected().get('sample'),conf)
        if(e.record.get('name')=='store'){
            e.record.commit()
            return false;
        }
        var ref=this.getGenericlist().down('#'+model.get('uiid'));
        
        if(ref.removeAll)
            var items=ref.removeAll(false);
        if(e.record.get('name')=="itemId")
            model.set('uiid',conf[e.record.get('name')])
        //if(items.length>0)
        //    conf.items=items;
        var parent=ref.up('container');
        var index=parent.items.indexOf(ref);
        parent.remove(ref,true)
        //console.log(conf)
        //console.log(items)
        
        var copy=Ext.clone(conf);
        //fixed for store and others
        if(ref.items)
            copy.items=[]
        if(copy.store){
            /**copy.store=Ext.create('Ext.data.TreeStore', {
                fields: ['name'],
                data : [],
                root: {
                    text: "Global",
                    expandable:false
                },
                storeName:conf.store
            });*/
        }
        var cmp=ref.cloneConfig(copy);
        
        parent.insert(index,cmp)
        if(cmp.add && model.get('text')!=='Ext.tree.Panel' && model.get('text')!=='Ext.grid.Panel' && model.get('text')!=='Ext.form.field.HtmlEditor')
            cmp.add(items)
        parent.doLayout()
        //this.getGenerictree().getSelectionModel().getLastSelected().get('ref').update()
        e.record.commit()
        if(cmp.getStore)
            console.log(cmp.getStore())
        //var r={name:'',value:''};
        //if(this.getAtributos().getStore().getAt(this.getAtributos().getStore().getCount()-1).get('name')!='')
        //    this.getAtributos().getStore().add(r);
    },
    onDeleteAttr:function(row){
        
        var key=row.get('name')
        if(key=='itemId' || key=='xtype')
            return false;
        if(!key)
            return false;
        
        this.getAtributos().getStore().remove(row);
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        var conf=Ext.clone(model.get('sample'))
        
        
        delete conf[key];
        
        model.set('sample',conf)
        //Ext.apply(this.getGenerictree().getSelectionModel().getLastSelected().get('sample'),conf)
        
        var ref=this.getGenericlist().down('#'+model.get('uiid'));
        
        if(ref.removeAll)
            var items=ref.removeAll(false);
        
        var parent=ref.up('container');
        var index=parent.items.indexOf(ref);
        parent.remove(ref,true)
        
        var copy=Ext.clone(conf);
        //fixed for store and others
        if(ref.items)
            copy.items=[]
        if(copy.store){
            /**copy.store=Ext.create('Ext.data.Store', {
                fields: ['name'],
                data : [],
                storeName:conf.store
            });*/
        }
        var cmp=Ext.create(model.get('text'),copy);
        
        parent.insert(index,cmp)
        if(cmp.add && model.get('text')!=='Ext.tree.Panel' && model.get('text')!=='Ext.grid.Panel' && model.get('text')!=='Ext.form.field.HtmlEditor')
            cmp.add(items)
        parent.doLayout()
        
    },
    onWindowAttr:function(row){
        var window=Ext.widget('genericwindow')
        window.down("textfield").setValue(row.get('value'))
        window.activerecord=row
    },
    
    onEditAreaAttr:function(btn){
        var record=btn.up('window').activerecord
        record.set('value',btn.up('window').down('textfield').getValue())
        btn.up('window').close()
        if(record.get('name')=='itemId' && !record.get('value'))
            return false;
        if(record.get('name')=='store' && !record.get('value'))
            return false;
        if(!record.get('name'))
            return false;
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        var conf=Ext.clone(model.get('sample'))
        //conf[e.record.get('name')]=e.record.get('value')
        var value=record.get('value');
        try {
            value=Ext.decode(value)
        } catch (ex) {
            value=record.get('value')
        }
        
        conf[record.get('name')]=Ext.isNumeric(value)?parseInt(value):value
        
        model.set('sample',conf)
        //Ext.apply(this.getGenerictree().getSelectionModel().getLastSelected().get('sample'),conf)
        if(record.get('name')=='store'){
            record.commit()
            return false;
        }
        var ref=this.getGenericlist().down('#'+model.get('uiid'));
        
        if(ref.removeAll)
            var items=ref.removeAll(false);
        if(record.get('name')=="itemId")
            model.set('uiid',conf[record.get('name')])
        //if(items.length>0)
        //    conf.items=items;
        var parent=ref.up('container');
        var index=parent.items.indexOf(ref);
        parent.remove(ref,true)
        //console.log(conf)
        //console.log(items)
        
        var copy=Ext.clone(conf);
        //fixed for store and others
        if(ref.items)
            copy.items=[]
        if(copy.store){
            /**copy.store=Ext.create('Ext.data.Store', {
                fields: ['name'],
                data : [],
                root: {
                    text: "Global",
                    expandable:false
                },
                storeName:conf.store
            });*/
        }
        var cmp=ref.cloneConfig(copy);
        
        parent.insert(index,cmp)
        if(cmp.add && model.get('text')!=='Ext.tree.Panel' && model.get('text')!=='Ext.grid.Panel' && model.get('text')!=='Ext.form.field.HtmlEditor')
            cmp.add(items)
        parent.doLayout()
        //this.getGenerictree().getSelectionModel().getLastSelected().get('ref').update()
        record.commit()
        //var r={name:'',value:''};
        //if(this.getAtributos().getStore().getAt(this.getAtributos().getStore().getCount()-1).get('name')!='')
        //    this.getAtributos().getStore().add(r);
    },
    onRender:function(){
        //Make Raptor control the UI to activate the privilege
      //  Raptor.controlActions();
      setTimeout(function(){
        if(window.$){
            $('.raptorjs-node-debug').hide()
        }
      },4000)
      
    },
    
    onListSelect: function() {
       
        
    },
    onListDeSelect: function() {
      
        
    },
    onTreeSelect: function (mode, model) {
        
        this.getButtonDelete().enable();
        
        this.getAtributos().getStore().loadData([]);
       
        var conf=model.get('sample');
        
        var ref=this.getGenericlist().down('#'+model.get('uiid'))
        
        var previus=this.getGenericlist().getEl().query('.comp-sel-designer')
        for (var i = 0; i < previus.length; i++) {
            Ext.fly(previus[i]).removeCls('comp-sel-designer')
        }
        //ref.getEl().highlight("0000ff !important", { attr: 'borderColor', duration: 2000 });
        
        if(ref.getEl())
            ref.getEl().addCls('comp-sel-designer');
        
        var cant=Object.keys(conf);
        for (var i = 0; i < cant.length; i++) {
            var value=conf[cant[i]];
            try {
                value=Ext.encode(value)
            } catch (ex) {
                value=conf[cant[i]]
            }
            this.getAtributos().getStore().add({
                name: cant[i],
                value: value
            });
        }
        var r={name:'',value:''};
        this.getAtributos().getStore().add(r);
        
    },
    
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    
    openUi:function(meta){
        this.activeStores=meta.store?meta.store:[];
        this.getGenericlist().down('#renderPanel').add(this.recursiveInit(meta.ui))
        
        this.getGenerictree().getStore().setRootNode({
            text: "src",
            expandable:true,
            uiid:'renderPanel',
            children: meta.tree,
            sample:{
                
            }
        })
        
        this.idgen=meta.idgen;
        
    },
    
    recursiveInit:function(meta){
        if(meta.store)
            delete meta.store;
        if(meta.items){
            for (var index = 0; index < meta.items.length; index++) {
                this.recursiveInit(meta.items[index])
            }
        }
        return meta;
    },

    afterRender:function(){
        Ext.data.StoreManager.lookup('myStore')
        this.StoreManagerSave=Ext.data.StoreManager.lookup;
        var me=this;
        Ext.data.StoreManager.lookup=function(name){
            var t=me.StoreManagerSave.apply(Ext.data.StoreManager,arguments)
            if(!t)
                t=Ext.create('Ext.data.Store', {
                    fields: ['name'],
                    data : [],
                    storeName: name
                })
            return t;
        }
        /**
        this.classManager=Ext.Loader.require
        
        Ext.Loader.require=function(a){
            var result = me.classManager.apply(this,arguments)
            console.log(a)
            return result;
        }*/
        
        
        //var data=require('electron').remote.getCurrentWindow().webContents.fileToOpen
       // this.tabid=require('electron').remote.getCurrentWindow().webContents.extjsPlugin.tabid
        if(false){
            this.prefixName=data.defineName
            this.configUi=data.config
            this.openUi(data)
            this.metadataUi=data;
        }else{
            this.configUi={}
            this.metadataUi={};
            Ext.widget('filewindow')
        }
    },
    
    onCmpName:function(btn){
        if(btn.up('window').down('form').isValid()){
            this.prefixName=btn.up('window').down('textfield').getValue();
            btn.up('window').close()
        }
    },
    
    onComponentesLoad:function(){
        this.getComponentes().getRootNode().cascadeBy(function(node){
            if(node.get("layout")){
                node.set('icon',Raptor.public("extjs-designer/resources/img/layout.png")) ;
           
            }else{
                if(node.get("leaf"))
                node.set('icon',Raptor.public("extjs-designer/resources/img/class-m.png")) ;
            }
             node.commit();
        });
    }

});



