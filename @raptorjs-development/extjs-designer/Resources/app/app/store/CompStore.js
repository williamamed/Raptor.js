Ext.define('Generate.store.CompStore', {
    extend: 'Ext.data.TreeStore',
    fields:['definition','text','sample','simulate','layout','simulateSample'],
    root: {
        expanded: true,
        children: [{ 
            text: "Panel", 
            expanded: true, 
            children: [{ 
                text: "Viewport", 
                leaf: true ,
                definition:"Ext.container.Container",
                simulate:"Ext.container.Viewport",
                sample:{
                    style:'padding:5px',
                    extend:"Ext.container.Viewport"
                }
            },{ 
                text: "Window", 
                leaf: true ,
                definition:"Ext.panel.Panel",
                simulate:"Ext.window.Window",
                sample:{
                    bodyStyle:'padding:5px',
                    title:'Panel'
                },
                simulateSample:{
                    bodyStyle:'padding:5px',
                    title:'Panel',
                    tools:[{
                        type:'close'
                    }]
                }
            },{ 
                text: "Panel", 
                leaf: true ,
                definition:"Ext.panel.Panel",
                sample:{
                    xtype:'panel',
                    title:'Panel',
                    bodyStyle:'padding:5px'
                }
            },{
                text:"Tree",
                leaf:true,
                definition:"Ext.tree.Panel",
                sample:{
                    xtype:'treepanel',
                    title:'Tree',
                    bodyStyle:'padding:5px'
                }
            },{
                text:"Grid",
                leaf:true,
                definition:"Ext.grid.Panel",
                sample:{
                    xtype:'gridpanel',
                    title:'Grid',
                    bodyStyle:'padding:5px',
                    columns:[{text:'Header'}]
                }
            },{
                text:"Tab",
                leaf: true,
                definition:"Ext.tab.Panel",
                sample:{
                    xtype:'tabpanel',
                    title:'Tab',
                    bodyStyle:'padding:5px'
                }
            },{
                text:"Container",
                leaf: true,
                definition:'Ext.container.Container',
                sample:{
                    style: {padding:'5px'},
                    xtype:'container'
                }
            },{
                text:"Form",
                leaf: true,
                definition:'Ext.form.Panel',
                sample:{
                    title:'Form panel',
                    bodyStyle:'padding:5px',
                    xtype:'form'
                }
            },{
                text:"Fieldset",
                leaf: true,
                definition:'Ext.form.FieldSet',
                sample:{
                    title:'Fieldset 1',
                    collapsible: true,
                    bodyStyle:'padding:5px',
                    xtype:'fieldset'
                }
            },{
                text:"Toolbar",
                leaf:true,
                definition:"Ext.toolbar.Toolbar",
                sample:{
                    xtype: 'toolbar'
                }
            }]
        },{
            text:"Input form",
            expanded:true,
            children:[{
                text:"TextField",
                leaf:true,
                definition:"Ext.form.field.Text",
                sample:{
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Name',
                    allowBlank: true
                }
            },{
                text:"ComboBox",
                leaf:true,
                definition:"Ext.form.field.ComboBox",
                sample:{
                    xtype: 'combobox',
                    name: 'name',
                    fieldLabel: 'Choose state',
                    allowBlank: true
                }
            },{
                text:"DateField",
                leaf:true,
                definition:"Ext.form.field.Date",
                sample:{
                    name: 'from_date',
                    fieldLabel: 'From',
                    allowBlank: true,
                    xtype: 'datefield'
                }
            },{
                text:"NumberField",
                leaf:true,
                definition:"Ext.form.field.Number",
                sample:{
                    xtype: 'numberfield',
                    name: 'counter',
                    fieldLabel: 'Counter',
                    value: 99,
                    maxValue: 99,
                    minValue: 0
                }
            },{
                text:"TimeField",
                leaf:true,
                definition:"Ext.form.field.Time",
                sample:{
                    xtype: 'timefield',
                    name: 'time',
                    fieldLabel: 'Time field',
                    minValue: '6:00 AM',
                    maxValue: '8:00 PM',
                    increment: 30,
                }
            },{
                text:"CheckboxGroup",
                leaf:true,
                definition:"Ext.form.CheckboxGroup",
                sample:{
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Two Columns',
                    // Arrange checkboxes into two columns, distributed vertically
                    columns: 2,
                    vertical: true
                }
            },{
                text:"Checkbox",
                leaf:true,
                definition:"Ext.form.field.Checkbox",
                sample:{
                    xtype:'checkboxfield',
                    boxLabel: 'Item 1', 
                    name: 'rb', 
                    inputValue: '1'
                }
            },{
                text:"RadioGroup",
                leaf:true,
                definition:"Ext.form.RadioGroup",
                sample:{
                    xtype: 'radiogroup',
                    fieldLabel: 'Two Columns',
                    // Arrange checkboxes into two columns, distributed vertically
                    columns: 2,
                    vertical: true
                }
            },{
                text:"Radio",
                leaf:true,
                definition:"Ext.form.field.Radio",
                sample:{
                    xtype:'radiofield',
                    boxLabel: 'Item 1', 
                    name: 'rb', 
                    inputValue: '1'
                }
            },{
                text:"TextArea",
                leaf:true,
                definition:"Ext.form.field.TextArea",
                sample:{
                    xtype: 'textareafield',
                    grow: true,
                    name: 'message',
                    fieldLabel: 'Message'
                }
            },{
                text:"HtmlEditor",
                leaf:true,
                definition:"Ext.form.field.HtmlEditor",
                sample:{
                    xtype: 'htmleditor',
                    enableColors: false,
                    enableAlignments: false
                }
            },{
                text:"SliderSingle",
                leaf:true,
                definition:"Ext.slider.Single",
                sample:{
                    xtype: 'slider',
                    width: 200,
                    value: 50,
                    increment: 10,
                    minValue: 0,
                    maxValue: 100
                }
            },{
                text:"SliderMulti",
                leaf:true,
                definition:"Ext.slider.Multi",
                sample:{
                    xtype: 'multislider',
                    width: 200,
                    values: [25, 50, 75],
                    increment: 5,
                    minValue: 0,
                    maxValue: 100,
                    constrainThumbs: false
                }
            },{
                text:"Button",
                leaf:true,
                definition:"Ext.button.Button",
                sample:{
                    xtype: 'button',
                    text: 'button'
                }
            }]
        },{
            text:"Layouts",
            expanded:true,
            children:[{
                text:"Fit",
                leaf:true,
                layout:true,
                definition:"fit",
                sample:{
                    
                }
            },{
                text:"Anchor",
                leaf:true,
                layout:true,
                definition:"anchor",
                sample:{
                    anchor:'100%'
                }
            },{
                text:"Border",
                leaf:true,
                layout:true,
                definition:"border",
                sample:{
                    region:'center'
                }
            },{
                text:"HBox",
                leaf:true,
                layout:true,
                definition:"hbox",
                sample:{
                    flex:1
                }
            },{
                text:"VBox",
                leaf:true,
                layout:true,
                definition:"vbox",
                sample:{
                    flex:1
                }
            }]
        }]
    }
});