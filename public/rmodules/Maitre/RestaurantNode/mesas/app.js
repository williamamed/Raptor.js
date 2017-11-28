UIR.Controller('SalonMesas.App', {
    showError: function(info, text) {
        $('.message .alert .msg-info').text(info)
        $('.message .alert .msg-text').text(text)
        $('.message .alert').removeClass('hidden');
    },
    initTable: function(cant,data,token) {
        var self=this;
        this.token=token
        this.table=$('#table-mesas').DataTable({
            "processing": true,
            "serverSide": true,
            scrollCollapse: true,
            data: data,
            "ajax": {
                "url": "/maitre/salon/mesas/list",
                "complete": function() {
                   self.editable()     
                }
            },
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [2],
                    "width": 45
                }
            ],
            "columns": [
                { 
                    "data": "id", 
                    title: "ID" 
                },
                { 
                    "data": "name", 
                    title: "Nombre" 
                },
                { 
                    "data": "name",
                    title: "Acciones",
                    createdCell:function(td,value,data){
                        
                        $(td).html($('.templates').html().replace('{id}',data.id))
                       
                    }
                }
            ],
            "deferLoading": cant

        });
        this.editable()
    },
    editable:function(){
        var self=this;
        this.table.$('td:first').editable('/maitre/salon/mesas/edit', {
            "callback": function(sValue, y) {
                //var aPos = oTable.fnGetPosition(this);
                //console.debug(oTable)
                //oTable.fnUpdate( sValue, aPos[0], aPos[1] );
                
            },
            indicator:'<img src="/public/rmodules/Maitre/PortalNode/img/load.gif" width="125">',
            "submitdata": function(value, settings) {
                return {
                    "id": self.table.cell(self.table.cell(this)[0][0].row, 0).data(),
                    "column": value,
                    "_csrf": self.token
                };
            },
            "cssclass":"editable-cell",        
            "height": "14px",
            "width": "100%"
        });
    },
    main: function() {
        $('#form-mesas').formUIR({
            url:'/maitre/salon/mesas/insert',
            validate: {
                rules: {
                    name: {
                        required: true,
                        maxlength: 50
                    }
                }
            }
        })
    }
})
   .run(function() {
    this.addEvents({
        '.mesas-eliminar': {
            delegate: '.salon-mesas',
            click: function(el, e) {
                $('#modalDelete .btn-primary').data('mesa-id',$(e.currentTarget).data('delete'))
                
            }
        },
        '#modalDelete .btn-primary': {
            click: function(el, e) {
                $('#modalDelete').modal('hide')
                var self=this;
                UIR.load.show('Espere por favor...')
                $.post('/maitre/salon/mesas/delete',{
                    id: $(e.currentTarget).data('mesa-id'),
                    _csrf: this.token
                })
                .done(function(){
                    UIR.load.hide()
                    self.table.ajax.reload(function(){},false)
                })
            }
        },
        '#modalMesa .btn-primary': {
            click: function() {
                if ($('#form-mesas').formUIR('validar')) {
                    UIR.load.show('Espere por favor...')
                    
                    $('#modalMesa').modal('hide')
                    $('#form-mesas').formUIR('submit')

                }

            }
        },
        '#form-mesas':{
            'form.success':function(){
                this.table.ajax.reload(function(){},false)
                UIR.load.hide()
                $('#form-mesas').formUIR('reset')
            }
        }
    })
    this.main()
})


