UIR.Controller('Profile.User', {
    elements: [{
            ref: '#profile-user',
            name: 'formUser'
        }],
    changePass: function() {
        if (this.getFormUser().find('input[name="new_password"]').val() !== this.getFormUser().find('input[name="confirm_password"]').val()) {
            Raptor.msg.error("La nueva clave y la confirmación no coinciden");
            return;
        }

        if (this.getFormUser().formUIR('validar')) {
            UIR.load.show('Cambiando su clave, en un momento completamos la acción ...');
            this.getFormUser().formUIR('submit');
        }
    },
    onChangePassSuccess: function(el, event, data) {
        UIR.load.hide()
        var response = data;

        if (response.success == true) {

            if (response.cod == 1) {
                Raptor.msg.info(response.msg);
                this.getFormUser().formUIR('reset');
            } else
                Raptor.msg.error(response.msg);

        } else {
            Raptor.msg.error(response.msg)
        }
    },
    onChangePassError: function(el, event, data) {
        UIR.load.hide();
        Raptor.msg.error('Ocurrio un error en la comunicacion, intentelo de nuevo mas tarde')
    },
    onChangeImage: function(el) {

        $("#file-neg").fileinput('clear')
        $('#uploadModal').modal('show');
        this.activeImage = $(el);

    },

    main: function() {
        this.getFormUser().formUIR({
            url: 'profile/changepass'
        });
        $('#profile-1').formUIR({
            url: 'profile/profiledata',
            validate: {
                rules: {
                    fullname: {
                        required: true,
                        maxlength: 50
                    },
                    email: {
                        required: true,
                        email: true
                    }
                }
            }
        });
        
        $("#file-profile").fileinput({
            showPreview: true,
            language: 'es',
            showUpload: false,
            fileActionSettings: {
                showUpload: false,
                showZoom: false,
                showRemove: false
            },
            uploadUrl: 'profile/uploadprocess',
            'allowedFileExtensions': ['jpg', 'png', 'gif']
        })
        Raptor.controlActions();
        
    }
})
        .run(function() {
    this.addEvents({
        '#btnChangePass': {
            click: this.changePass
        },
        '#profile-user': {
            'form.success': this.onChangePassSuccess,
            'form.error': this.onChangePassError
        },
        '.image-profile': {
            click: this.onChangeImage
        },
        '#file-profile': {
            fileselect: function() {
                $('#btnAceptUpload').removeAttr('disabled');
            },
            fileclear: function() {

                $('#btnAceptUpload').attr('disabled', 'disabled');
            },
            fileuploaded: function(el, e, data) {
                $('#btnUploadClose').removeAttr('disabled');
                $('#btnAceptUpload').removeAttr('disabled');
                if (data.response.cod === 1 && data.response.image) {
                    $('#uploadModal').modal('hide');
                    this.activeImage.attr('src', Raptor.getBundleResource('security_photos/' + data.response.image))
                }
            },
            fileuploaderror: function() {
                $('#btnUploadClose').removeAttr('disabled');
                $('#btnAceptUpload').removeAttr('disabled');
            }
        },
        '#btnAceptUpload': {
            click: function() {
                if ($("#file-profile").fileinput('getFilesCount') == 0) {
                    Raptor.msg.error('¡Escoja una foto de perfil!');
                    return;
                }
                $('#btnUploadClose').attr('disabled', 'disabled');
                $('#btnAceptUpload').attr('disabled', 'disabled');
                $("#file-profile").fileinput('upload');
            }
        },
        '#userdata .edit-profile-1': {
            click: function(el, e) {
                $('.panel-show-1').hide();
                $('.panel-edit-1 input[name="fullname"]').val($('.profile-1-fullname').text());

                $('.panel-edit-1 input[name="email"]').val($('.profile-1-email').text());
                
                $('.panel-edit-1').fadeIn();
            }

        },
        '#userdata .cancel-profile-1': {
            click: function(el, e) {
                $('.panel-edit-1').hide();
                $('.panel-show-1').fadeIn();

            }
        },
        '#userdata .save-profile-1': {
            click: function(el, e) {
                if ($('#profile-1').formUIR('validar')) {
                    $('.profile-1-fullname').html($('.panel-edit-1 input[name="fullname"]').val());

                    $('.profile-1-email').html($('.panel-edit-1 input[name="email"]').val());
                    
                    $('.panel-edit-1').hide();
                    $('.panel-show-1').show();

                    $('#profile-1').formUIR('submit', {
                        data: {
                            state: 1
                        }
                    });
                }
            }
        },
        '.profile-form': {
            'form.success': function(el, e, data) {
                if (data.cod == 1)
                    Raptor.msg.info(data.msg);
                else
                    Raptor.msg.error(data.msg);
            },
            'form.error': function(el, e, data) {
                Raptor.msg.error("<div style='max-width:300px'>Ocurrió un error en la comunicación, por favor intente de nuevo</div>")
            }
        },
        
    });
    this.main();
})