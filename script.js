var App = (function() {
    var _this;
    var $source;
    var itemCounter = 0;

    var colors = [
        'green', // green
        'blue', // blue
        'purple', // purple
        'yellow', // yellow
        'red', // red
        'gray', 
    ];

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
        $columns.on('click', '.colorbtn', this.changeColor);

        $('.control').on('click', null, this.add);

        $('.colorbtn').hide();

        return this;
    };

    /* Item actions */

    App.prototype.add = function(e, col) {
        itemCounter++;

        var mCol = col || 1;

        var itemTemplate = $('#item_template').text();
        var $newItem = $(document.createElement('div'))
                .html(itemTemplate).contents();
        
        $('#col' + mCol + ' ul li:last-child').before($newItem);

        var text = "Item " + itemCounter;

        if(col == undefined) {
            // This was added through add button
            _this.addEditField($newItem.find('div'), text);
        } else {
            // Likely called manually
            $newItem.find('.content').text(text);
        }
    };

    App.prototype.edit = function(e) {
        var $itemDiv = $(this).parent();

        var $content = $itemDiv.find('.content');
        var text = $content.text();

        _this.addEditField($itemDiv, text);

        $itemDiv.find('.colorbtn').show();
    };

    App.prototype.endEdit = function(e) {
        e.stopPropagation();
        console.log('endedit');

        var $this, $itemDiv, text;
        
        $this = $(this);
        $itemDiv = $this.parent();
        text = e.data.text;

        if(text instanceof jQuery) {
            text = text.val();
        }

        $itemDiv.find('.content').text(text).show();

        $itemDiv.find('textarea').remove();
        $itemDiv.find('.colorbtn').hide();
        $itemDiv.off('click');
    }

    App.prototype.delete = function(e) {
        console.log('deleting');
        $(this).parents('li').remove();
    }

    App.prototype.changeColor = function(e) {
        var $this = $(this);

        $this.parent().find('header').removeClass(function() {
            return colors.join(' ');
        }).addClass(function() {
            return $this.attr('class').split(' ')[2];
        });
    }

    /* --------- */

    App.prototype.addEditField = function($itemDiv, content) {
        var $editField;

        $itemDiv.find('.content').hide();

        $editField = $(document.createElement('textarea')).attr({
            type: 'text',
            class: 'editfield',
            rows: 1
        }).html(content);

        $editField.on('keydown focus select blur', null, function(e) {
            var rows = this.value.split("\n").length || 1;
            $(this).height((rows * 20)+20);
        });

        // Keep edits
        $itemDiv.on(
            'click', 
            '.item_edit', 
            { text: $editField },
            _this.endEdit);

        // Cancel edits
        $itemDiv.on(
            'click', 
            '.item_delete', 
            { text: content },
            _this.endEdit);

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
