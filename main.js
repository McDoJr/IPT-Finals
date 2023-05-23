$(document).ready(function () {
    const toggle = document.querySelector('.arrow');
    const form = document.querySelector('form');
    const container = document.querySelector('.form');
    var register = $('#register');
    var update = $('#update');
    var search = $('#search');

    let id;

    const status = localStorage.getItem('status');

    update.hide();

    const hide = () => {
        $('form').hide();
        container.style.height = '70px';
        localStorage.setItem('status', 'hidden');
        toggle.classList.add('fa-caret-down');
    }

    const show = () => {
        $('form').show();
        container.style.height = 'auto';
        localStorage.removeItem('status');
        toggle.classList.remove('fa-caret-down');
    }

    const clearFields = () => {
        $('form input[type="text"]').val('');
        $('form input[type="tel"]').val('');
        $('form input[type="number"]').val('');
        $('form input[type="email"]').val('');
        $('form select').val('');
    };

    // Get data from database

    const get = (choice) => {
        // serialize form data
        var formData = $("#id").serializeArray();
        
        if(!choice){
            formData.push({name: 'id', value: id});
        }

        const finalUrl = choice ? "http://172.17.100.12:8081/bejerano/IPT-Finals/get.o" : "http://172.17.100.12:8081/bejerano/IPT-Finals/delete.o";

        // send AJAX request
        $.ajax({
            url: finalUrl,
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if (response.status === "success") {

                    if (choice) {
                        var template = Handlebars.compile($("#listitems").html());
                        var html = template(response);

                        $("#tbody").html(html);
                    } else {
                        $('input[type="text"]').val('');
                        get(true);
                    }

                } else if (response.status === "error") {
                    console.log(response.message)
                    console.log(response.message_additional)
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }

    const post = (choice) => {
        var formData = $("#form").serializeArray();
        if(!choice){
            formData.push({name: 'id', value: id});
        }
        const finalUrl = choice ? "http://172.17.100.12:8081/bejerano/IPT-Finals/post.o" : "http://172.17.100.12:8081/bejerano/IPT-Finals/update.o";

        // send AJAX request
        $.ajax({
            url: finalUrl,
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if (response.status === "success") {
                    console.log(response.message)
                    console.log(response.data)
                    clearFields();
                    get(true);

                } else if (response.status === "error") {
                    console.log(response.message)
                    console.log(response.message_additional)
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    if (status) {
        toggle.classList.toggle('fa-caret-down');
        hide();
    }

    get(true);

    toggle.addEventListener('click', (e) => {
        e.preventDefault();

        if (form.style.display === 'none') {
            show();
        } else {
            hide();
        }
    })

    // Search Button

    search.click(function (e) {
        get(true);
    });

    // Update Button

    update.click(function (e) {
        e.preventDefault();
        
        post(false);
        
        clearFields();
        update.hide();
        register.show();
    });

    // Register Button

    register.click(function (e) {
        e.preventDefault();

        // serialize form data
        post(true);
    });

    $('body').on('click', '.table .tbody .tr', function (e) {
        const list = this.children;
        id = list[0].innerHTML;

        if (localStorage.getItem('status')) {
            show();
        }
        
        if(e.target.id === 'delete'){
            get(false);
            return;
        }

        register.hide();
        update.show();

        
        $('#fullname').val(list[1].innerHTML);
        $('#email').val(list[2].innerHTML);
        $('#phone').val(list[3].innerHTML);
        $('#age').val(list[4].innerHTML);
        $('#gender').val(list[5].innerHTML);
        $('#municipality').val(list[6].innerHTML);
        $('#year').val(list[7].innerHTML);
        $('#course').val(list[8].innerHTML);
    });
});
