// Credit: http://bootsnipp.com/snippets/W06v1

var main = function () {
    "use strict";
    
    // Check cookie if the user is signed in
    var cookie = document.cookie;
    var username = cookie.substring("username=".length, cookie.length);
    
    // Clear cookies
    document.cookie = "username=" + username + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    console.log(username);
    console.log(document.cookie);
    
    
    $.get("http://localhost:3000/users", function (users) {

        var indexArray = [];
        for(var i = 0; i < users.length; i++) {
            indexArray.push(i);
        }
        
        // Shuffle indexArray
        // Credit: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
        var j, x, i;
        for (i = indexArray.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = indexArray[i - 1];
            indexArray[i - 1] = indexArray[j];
            indexArray[j] = x;
        }

        var i = 0;
        users.forEach(function () {
            
            var user = users[indexArray[i]];
            i++;
            // Article
            var $article = $("<article>").attr("class", "white-panel");
            $article.hide();

            // Imgage
            var $img = $("<img>").attr({
                "src" : user.profilePicURL,
                "alt" : user.fname + " " + user.lname
            });

            // Set img as a link to profile for each user
            $img.on("click", function () {
                document.cookie = "username=" + user.username;
                document.cookie = "login=no";
                window.location.href = "profile.html";
            });

            // Name
            var $name = $("<h4>").append(user.fname + " " + user.lname);

            // Job title
            var $title = $("<p>").text = user.jobTitle;

            // Tags
            var tagsString = "";
            var $tags = $("<p>");
            user.tags.split(",").forEach(function (tag) {

                // Remove white space from tag
                if (tag.indexOf(" ") === 0) {
                    tag = tag.substring(1);
                }
                $tags.append($("<span>").append( tagsString + " #" + tag ));
            });

            // var $tags = $("<span>").text = tags;

            $article.append($img, $name, $title, $("<br>"), $tags);
            $("#pinBoot").append($article);
            $article.fadeIn();
        });
    });
};

$(document).ready(function() {
    main();
$('#pinBoot').pinterest_grid({
no_columns: 4,
padding_x: 10,
padding_y: 10,
margin_bottom: 50,
single_column_breakpoint: 700
});
});

/*
Ref:
Thanks to:
http://www.jqueryscript.net/layout/Simple-jQuery-Plugin-To-Create-Pinterest-Style-Grid-Layout-Pinterest-Grid.html
*/


/*
Pinterest Grid Plugin
Copyright 2014 Mediademons
@author smm 16/04/2014

usage:

 $(document).ready(function() {

    $('#blog-landing').pinterest_grid({
        no_columns: 4
    });

});


*/
;(function ($, window, document, undefined) {
var pluginName = 'pinterest_grid',
    defaults = {
        padding_x: 10,
        padding_y: 10,
        no_columns: 3,
        margin_bottom: 50,
        single_column_breakpoint: 700
    },
    columns,
    $article,
    article_width;

function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
}

Plugin.prototype.init = function () {
    var self = this,
        resize_finish;

    $(window).resize(function() {
        clearTimeout(resize_finish);
        resize_finish = setTimeout( function () {
            self.make_layout_change(self);
        }, 11);
    });

    self.make_layout_change(self);

    setTimeout(function() {
        $(window).resize();
    }, 500);
};

Plugin.prototype.calculate = function (single_column_mode) {
    var self = this,
        tallest = 0,
        row = 0,
        $container = $(this.element),
        container_width = $container.width();
        $article = $(this.element).children();

    if(single_column_mode === true) {
        article_width = $container.width() - self.options.padding_x;
    } else {
        article_width = ($container.width() - self.options.padding_x * self.options.no_columns) / self.options.no_columns;
    }

    $article.each(function() {
        $(this).css('width', article_width);
    });

    columns = self.options.no_columns;

    $article.each(function(index) {
        var current_column,
            left_out = 0,
            top = 0,
            $this = $(this),
            prevAll = $this.prevAll(),
            tallest = 0;

        if(single_column_mode === false) {
            current_column = (index % columns);
        } else {
            current_column = 0;
        }

        for(var t = 0; t < columns; t++) {
            $this.removeClass('c'+t);
        }

        if(index % columns === 0) {
            row++;
        }

        $this.addClass('c' + current_column);
        $this.addClass('r' + row);

        prevAll.each(function(index) {
            if($(this).hasClass('c' + current_column)) {
                top += $(this).outerHeight() + self.options.padding_y;
            }
        });

        if(single_column_mode === true) {
            left_out = 0;
        } else {
            left_out = (index % columns) * (article_width + self.options.padding_x);
        }

        $this.css({
            'left': left_out,
            'top' : top
        });
    });

    this.tallest($container);
    $(window).resize();
};

Plugin.prototype.tallest = function (_container) {
    var column_heights = [],
        largest = 0;

    for(var z = 0; z < columns; z++) {
        var temp_height = 0;
        _container.find('.c'+z).each(function() {
            temp_height += $(this).outerHeight();
        });
        column_heights[z] = temp_height;
    }

    largest = Math.max.apply(Math, column_heights);
    _container.css('height', largest + (this.options.padding_y + this.options.margin_bottom));
};

Plugin.prototype.make_layout_change = function (_self) {
    if($(window).width() < _self.options.single_column_breakpoint) {
        _self.calculate(true);
    } else {
        _self.calculate(false);
    }
};

$.fn[pluginName] = function (options) {
    return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName,
            new Plugin(this, options));
        }
    });
}

})(jQuery, window, document);
