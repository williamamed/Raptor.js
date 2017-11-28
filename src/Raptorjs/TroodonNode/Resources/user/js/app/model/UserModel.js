Ext.define('GestUser.model.UserModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'fullname', 'username','icon','security_rols', 'rolname', 'password', 'state', 'email'],
    proxy: {
        type: 'ajax',
        url:'user/list',
        actionMethods: {//Esta Linea es necesaria para el metodo de llamada POST o GET
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