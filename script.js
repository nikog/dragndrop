var App = (function() {
    var _this;
    var dragEle;

    var App = function() {
        _this = this;
    };

    App.prototype.init = function() {
        var $columns = $('.column');

        $columns.on('dragstart', '[draggable=true]', _this.dragStart);
        $columns.on('dragend', '[draggable=true]', _this.dragEnd);

        $columns.on('dragenter', '[draggable=true]', _this.dragEnter);
        $columns.on('dragleave', '[draggable=true]', _this.dragLeave);
        
        $columns.on('dragover', 'ul li', _this.dragOver);
        $columns.on('drop', 'ul li', _this.drop);

        $columns.on('click', 'h3', this.onEdit);

        $('.control').on('click', null, this.onAdd);

        $('.new').hide();
    };

    App.prototype.onAdd = function(e) {
        var itemTemplate = $('#item_template').text();
        var newItem = $('#col1 ul').prepend(
            $(document.createElement('div')).html(itemTemplate).contents());

        _this.addEditField(newItem.find('li div').first(), "y u no work");
    };

    App.prototype.onEdit = function(e) {
        var $itemDiv = $(this).parent();
        var text = $(this).text();

        $(this).remove();
        _this.addEditField($itemDiv, text);
    };

    App.prototype.addEditField = function($itemDiv, text) {
        var $editField = $(document.createElement('textarea')).attr({
            type: 'text',
            class: 'editfield',
            rows: 1
        }).html(text);

        $editField.on('keydown focus select blur', null, function(e) {
            var rows = this.value.split("\n").length || 1;

            $(this).height((rows * 20)+20);
            //this.rows = rows;
        });

        $editField.on('blur keypress', null, function(e) {
            if(e.which === 12 || e.type === "blur") {
                $itemDiv.append(
                    $(document.createElement('h3'))
                    .text($editField.val() || text) );
                $editField.remove();
            }
        });

        $itemDiv.append($editField);

        $editField.select();
    }

    App.prototype.dragStart = function(e) {
        this.style.opacity = '0.4';
        e.originalEvent.dataTransfer.dropEffect = 'move';

        dragEle = this;
    };

    App.prototype.dragOver = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }

        return false;
    };

    App.prototype.dragEnter = function(e) {
        // this / e.target is the current hover target.
        $(this).addClass('over');
        $(this).parent().children('li div h3').addClass('nodrop');
    };

    App.prototype.dragLeave = function(e) {
        $(this).parent().children('li div h3').removeClass('nodrop');
    };

    App.prototype.dragEnd = function(e) {
        this.style.opacity = 1;
    };

    App.prototype.drop = function(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        dragEle.style.opacity = 1;
        $(this).before($(dragEle.outerHTML));
        $(dragEle).remove();

        return false;
    };

    return App;
})();

new App().init();