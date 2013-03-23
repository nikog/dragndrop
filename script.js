var App = (function() {
    var _this;
    var $source;
    var itemCounter = 0;

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

        $columns.on('click', '.item_delete', this.delete);
        $columns.on('click', '.item_edit', this.edit);

        $('.control').on('click', null, this.add);

        $('.new').hide();

        return this;
    };

    /* Item actions */

    App.prototype.add = function(e, col) {
        itemCounter++;

        col = col || 1;

        var itemTemplate = $('#item_template').text();
        var newItem = $(document.createElement('div')).html(itemTemplate).contents();
        
        $('#col' + col + ' ul li:last-child').before(newItem);

        //console.log(newItem.find('div'));
        _this.addEditField(newItem.find('div'), "Item " + itemCounter);
    };

    App.prototype.edit = function(e) {
        var $itemDiv = $(this).parent();

        var $content = $(this).parent().find('h3');
        var text = $content.text();

        $content.remove();
        _this.addEditField($itemDiv, text);
    };

    App.prototype.delete = function(e) {
        console.log('deleting');
        $(this).parents('li').remove();
    }

    /* --------- */

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

    /* Drag events */

    App.prototype.dragStart = function(e) {
        console.log('dragging');
        e.originalEvent.dataTransfer.dropEffect = 'move';

        $source = $(this).parents('li');
        $source.find('header').css({opacity: 0.4});
    };

    App.prototype.dragOver = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }

        return false;
    };

    App.prototype.dragEnter = function(e) {
        var $this = $(this);
        $this.addClass('over');
        $this.parent().children('li div h3').addClass('nodrop');
    };

    App.prototype.dragLeave = function(e) {
        $(this).parent().children('li div h3').removeClass('nodrop');
    };

    App.prototype.dragEnd = function(e) {
        $source.find('header').css({opacity: 1});
    };

    App.prototype.drop = function(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        $source.find('header').css({opacity: 1});

        var $target, sourceHTML;

        $target = $(this);
        sourceHTML = $source[0].outerHTML;

        if($target.is(':last-child')) {
            // Last child that spans the whole column
            $target.before(sourceHTML);
        } else if($target.parents('ul')[0] != $source.parents('ul')[0]) {
            // Another column
            $target.before(sourceHTML)
        } else {
            if($target.index() < $source.index()) {
                $target.before(sourceHTML);
            } else {
                $target.after(sourceHTML);
            }
        }

        $source.remove();

        return false;
    };

    /* --------- */

    App.prototype.addExampleItems = function() {
        console.log('Adding examples');
        this.add(null, 1);
        this.add(null, 2);
        this.add(null, 2);
        this.add(null, 3);

        return this;
    }

    return App;
})();

var app = new App();
app.addExampleItems().init();
