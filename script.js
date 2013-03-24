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

    var cache = {};

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

        cache.$newItemTpl = $(document.createElement('div'))
                .html($('#item_template').text()).contents();

        return this;
    };

    /* Item actions */

    App.prototype.add = function(e, col) {
        itemCounter++;

        var mCol = col || 1;

        cache.$newItem = cache.$newItemTpl.clone();

        $('#col' + mCol + ' ul li:last-child').before(cache.$newItem);

        var text = "Item " + itemCounter;

        cache.$itemDiv = cache.$newItem.find('div');
        cache.$content = cache.$itemDiv.find('p');

        if(col == undefined) {
            // This was added through add button
            _this.addEditField(text);
        } else {
            // Likely called manually
            cache.$content.text(text);
        }
    };

    App.prototype.edit = function(e) {
        cache.$itemDiv = $(this).closest('div');
        cache.$content = cache.$itemDiv.find('p');

        var text = cache.$content.text();

        _this.addEditField(text);
    };

    App.prototype.endEdit = function(e) {
        e.stopPropagation();
        console.log('endedit');

        if(e.data.action == 'save') {
            cache.$content.text(cache.$editField.val());
        }

        cache.$content.show();
        cache.$editField.remove();
        cache.$colorbtn.hide();
        cache.$itemDiv.off('click');
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

    // Replace static text with editable field
    App.prototype.addEditField = function(content) {
        var $editField;

        cache.$content.hide();

        cache.$editField = $(document.createElement('textarea')).attr({
            type: 'text',
            class: 'editfield',
            rows: 1
        }).html(content);

        cache.$editField.on('keydown focus select blur', null, function(e) {
            var rows = this.value.split("\n").length || 1;
            $(this).height((rows * 20)+20);
        });

        // Keep edits
        cache.$itemDiv.on(
            'click', 
            '.item_edit', 
            { action: 'save' },
            _this.endEdit);

        // Cancel edits
        cache.$itemDiv.on(
            'click', 
            '.item_delete',
            { action: 'cance' },
            _this.endEdit);

        cache.$itemDiv.append(cache.$editField);

        cache.$colorbtn = cache.$itemDiv.find('.colorbtn').show();

        cache.$editField.select();
    }

    /* Drag events */

    App.prototype.dragStart = function(e) {
        console.log('dragging');
        e.originalEvent.dataTransfer.dropEffect = 'move';

        $source = $(this).parents('li');
        cache.$header = $source.find('header');
        cache.$header.css({opacity: 0.4});
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
        cache.$header.css({opacity: 1});
    };

    App.prototype.drop = function(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        cache.$header.css({opacity: 1});

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
app.init().addExampleItems();
