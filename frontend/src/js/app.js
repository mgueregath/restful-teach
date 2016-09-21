(function ($) {
    var basePath = "http://mydomain.com:8080/";
    
    
    
    var addCard = function (firstName, lastName, content, image, id) {
        var card = '<div id="' + id + '" class="col s4">' +
            '<div class="card small">' +
            '<div class="card-image">' +
            '<img src="' + image + '">' +
            '<span class="card-title">' + firstName + ' ' + lastName + '</span>' +
            '</div>' +
            '<div class="card-content">' +
            '<p>' + content + '</p>' +
            '</div>' +
            '<div class="card-action">' +
            '<a href="#">Ver</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('#wrapper').append(card);
        $('.nav-wrapper.container #nav-mobile li .badge').html($('#wrapper').children().length);
    };
    
    var editCard = function (firstName, lastName, content, image, id) {
        $('#' + id + ' .card-image img').attr('src', image);
        $('#' + id + ' .card-title').html(firstName + ' ' + lastName);
        $('#' + id + ' .card-content').html(content);
    };
    
    var removeCard = function (id) {
        $('#' + id).remove();
        $('.nav-wrapper.container #nav-mobile li .badge').html($('#wrapper').children().length);
    };
    
    $(document).ready(function () {
        var socket = io.connect(basePath);
        
        $.ajax({
            url: basePath + "users/",
            type: "GET",
            dataType: "json",
            success: function (data) {
                $.each(data.data, function(index, item) {
                    console.log(item);
                    addCard(item.first_name, item.last_name, item.comment, item.img, item._id);
                });
            },
            error: function () {

            }

        });
        
        socket.on("new_user", function(user) {
            console.log(user);
            addCard(user.first_name, user.last_name, user.comment, user.img, user._id);
        });
        
        socket.on("edit_user", function(user) {  
            console.log(user);
            editCard(user.first_name, user.last_name, user.comment, user.img, user._id);
        });
        
        socket.on("delete_user", function(user) { 
            console.log(user);
            removeCard(user);
        });
    });
    
})(jQuery);