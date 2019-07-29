Ext.define('Example1.view.Viewport',{
  "style": "padding:5px",
  "extend": "Ext.container.Viewport",
  "itemId": "Viewport",
  "defineName": "Example1",
  "layout": "fit",
  "items": [
    {
      "xtype": "panel",
      "title": "Panel Extjs de ejemplo",
      "bodyStyle": "padding:5px",
      "itemId": "Example12",
      "layout": "anchor",
      "items": [
        {
          "xtype": "tabpanel",
          "bodyStyle": "padding:5px",
          "itemId": "Example14",
          "anchor": "100% 90%",
          "items": [
            {
              "xtype": "panel",
              "title": "Opcion 1",
              "bodyStyle": "padding:5px",
              "itemId": "Example15",
              "items": [
                {
                  "xtype": "textfield",
                  "name": "name",
                  "fieldLabel": "Name",
                  "allowBlank": true,
                  "itemId": "Example18"
                }
              ]
            },
            {
              "xtype": "panel",
              "title": "Opcion 2",
              "bodyStyle": "padding:5px",
              "itemId": "Example17",
              "items": [
                {
                  "xtype": "combobox",
                  "name": "name",
                  "fieldLabel": "Choose state",
                  "allowBlank": true,
                  "itemId": "Example19"
                }
              ]
            },
            {
              "xtype": "panel",
              "title": "Usuarios",
              "bodyStyle": "padding:5px",
              "itemId": "Example113",
              "layout": "fit",
              "items": [
                {
                  "xtype": "gridpanel",
                  "title": "Grid",
                  "bodyStyle": "padding:5px",
                  "columns": [
                    {
                      "text": "Header"
                    }
                  ],
                  "itemId": "Example114"
                }
              ]
            }
          ]
        },
        {
          "xtype": "toolbar",
          "itemId": "Example110",
          "anchor": "100% 10%",
          "items": [
            {
              "xtype": "button",
              "text": "Add",
              "itemId": "Example111"
            },
            {
              "xtype": "button",
              "text": "Edit",
              "itemId": "Example112"
            }
          ]
        }
      ]
    }
  ]
});