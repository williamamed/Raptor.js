/**
* Esta definicion de componente es generada de forma automatica
* por Extjs Designer de Raptor Studio 
* Proyecto Raptor - #RaptorWebCuba, #NodeDevCuba
* 
*/ 
 
Ext.define("Radio.view.gfd",{
	bodyStyle: "padding:5px",
	defineName: "gfd",
	itemId: "gfd1",
	items: [
		{
			fieldLabel: "Message",
			grow: true,
			itemId: "gfd2",
			name: "message",
			xtype: "textareafield"
		},
		{
			increment: 10,
			itemId: "gfd3",
			maxValue: 100,
			minValue: 0,
			value: 50,
			width: 200,
			xtype: "slider"
		}
	],
	title: "Panel",
	xtype: "panel",
	initComponent: function (){
                this.callParent()
            },
	extend: "Ext.panel.Panel"
})