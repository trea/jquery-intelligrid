(function( $ ){
    $.extend($.fn, {
        intelligrid: function(settings){
            var thead = $(this).children('thead');
            var tbody = $(this).children('tbody');
            var allRows = $(this).children('tbody').children('tr');
        	var actbar = {};   /*  We're gonna need this later, store the object of the actions bar */
        	var actions = (typeof settings.actions != undefined) ? settings.actions : null;    /*  Snag up the actions from settings so we can iterate those soon */
            var currentSelection = [];  /*  We're going to store the selected row objects here  */
            var events = {};

            var select = function(rows) {   /*  Select one or all of the things */
                if (typeof rows == 'string' && rows == 'all') {
                    rows = allRows;
                }
                $(rows).each(function(){
                        $(this).addClass('active');
                        $(this).children('td:first-child').children('i').addClass('icon-check');
                });
                currentSelection = $(tbody).find('tr.active');
                $(events).trigger('selectionChange');
            };
            var toggleselect = function(rows) {
                if (typeof rows == 'string' && rows == 'all') {
                    rows = allRows;
                }
                $(rows).each(function(){
                    if ($(this).is('.active')) {
                        $(this).removeClass('active');
                        $(this).children('td:first-child').children('i').removeClass('icon-check');
                    }
                    else {
                        $(this).addClass('active');
                        $(this).children('td:first-child').children('i').addClass('icon-check');
                    }
                });
            }
            var deselect = function(rows) {     /*  Deselect one or all of the things */
                if (typeof rows == 'string' && rows == 'all') {
                    rows = allRows;
                }
                $(rows).each(function(){
                    $(this).removeClass('active');
                    $(this).children('td:first-child').children('i').removeClass('icon-check');
                });
                currentSelection = $(tbody).find('tr.active');
                $(events).trigger('selectionChange');
            };
            
            /*  Some actions may only be applicable to one row at a time, 
                so let's make sure that when there are no rows selected, 
                all of the actions are greyed out.  When one is selected,
                all of the options should be available.  When multiple rows
                are selected, we need to disable actions that should only
                be applicable to one row.
            */
            var applicableAction = function() {
                if (currentSelection.length == 0) {
                    // Nothing is selected.  Kill all the actions.
                    $(actbar).find('div.group [data-action]').each(function(){
                        $(this).animate({opacity: 0.5}).addClass('disabled');
                    });
                    $(actbar).find('[data-action]').each(function(){
                        $(this).animate({opacity: 0.5}).addClass('disabled');
                    });
                }
                else if (currentSelection.length == 1) {
                    $(actbar).find('div.group [data-action]').each(function(){
                        $(this).animate({opacity: 1.0}).removeClass('disabled');
                    });
                    $(actbar).find('[data-action]').each(function(){
                        $(this).animate({opacity: 1.0}).removeClass('disabled');
                    });
                }
                else {
                    $(actbar).find('.single[data-action]').each(function(){
                        $(this).animate({opacity: 0.5}).addClass('disabled');
                    })
                }
            };

            $(this).attr('data-intelligrid', '');   /*  Let's tack on a data attribute so we can assign some CSS to just Intelligrid tables */

            $(events).bind('selectionChange', function(){   /*  Bind to table selection change so we can run through and determine what actions are applicable to the selection */
                applicableAction();
            });

            $(events).bind('handleAction', function(e, button) {    /*  Bind to the click of an action button*/
                if ($(button).attr('data-action') != undefined && $(button).attr('data-action') != null) {  /*  We need to determine if it is a custom action, and if it is fire it's function */
                    if (typeof(actions[$(button).attr('data-action')].action) != undefined) {
                        actions[$(button).attr('data-action')].action(currentSelection);
                    }
                }
                else {
                    // The button clicked doesn't seem to have a custom action type associated with it, so it might be one of the defaults
                    if ($(button).attr('data-refresh') != undefined && $(button).attr('data-refresh') != null) {
                        if (actions.hasOwnProperty('refresh') && typeof actions.refresh.action != undefined && actions.refresh.hasOwnProperty('action')) {
                            // In this case it is our own refresh function being overridden.  So let's just call their defined function and call it a day.
                            actions.refresh.action();
                        }
                        else {
                            // It is the refresh, and they haven't overridden the default behavior.  So for now, let's just refresh the page.
                            // Hopefully later on in the life of this plugin, we'll be refreshing a JSON data source rather than the whole page.
                            document.location = document.location;
                        }
                    }
                }
            });
        	if (!actions) {
        		// No actions were defined.  At this point, can't decide if we even bother.
        	}
        	else {
                $(tbody).on('click', 'tr', function(e){
                    if (e.ctrlKey) {
                        // Add this to the current selection
                        toggleselect($(this));
                    }
                    else if (e.shiftKey) {
                        // Add multiple to the current selection
                        // Grab the last row, and the row that's clicked
                        // Between those, select all the rows
                        var lastSelected = $(tbody).children('tr.active:last').index();
                        var currentSelected = ($(this).index());

                        if (currentSelected < lastSelected) {
                            $(tbody).children('tr').slice(currentSelected, lastSelected).each(function(){
                                select($(this));
                            });
                        }
                        else {
                            $(tbody).children('tr').slice(lastSelected, currentSelected).each(function(){
                                select($(this));
                            });
                        }
                        select($(this));
                    }
                    else {
                        // Deselect everything else
                        // $(this).parent('tbody').children('tr').each(function(){
                        // });
                        deselect('all');
                        select($(this));
                    }
                });
                $(tbody).on('dblclick', 'tr', function(){
                    if (actions.hasOwnProperty('view')) {
                        actions.view.action(this);
                    }
                });
                // We've got some actions to use on this table.  So add a th/td for being selected/not selected indicator
	        	$(this).children('thead').children('tr').children('th:first-child').before('<th></th>');  /*  In the table header */
	        	$(this).children('tbody').find('tr').each(function(){
                    // And in each of the tbody rows
	        		$(this).find('td:first-child').before('<td><i class="icon-"></i></td>');
	        	});
                // Also, create our actions bar
	        	var actbar = $(this).before('<div data-actions></div>').parent().find('div[data-actions]');
        		// Get it started with a select all and select none
                // Put them in their own group
        		$(actbar).append('<div class="group"><a class="btn btn-mini" data-all>Select All</a><a class="btn btn-mini" data-none>Select None</a></div>');
                $(actbar).on('click', 'div [data-all]', function(){
                    select('all');
                });
                $(actbar).on('click', 'div [data-none]',function(){
                    deselect('all');
                });
                $(actbar).on('click', 'div [data-add]', function(){
                    if (actions.hasOwnProperty('add')) {
                        actions.add.action();
                    }
                });

    			for (ind in actions) {
                    if (ind != 'view') {
        				var action = actions[ind];
                        if (ind == 'refresh') {
                            var refreshed = true;
                            var datatag = 'data-refresh';
                        }
                        else if (ind == 'add') {
                            var datatag = 'data-add';
                        } 
                        else {
                            var datatag = 'data-action="' + ind + '"'
                        }

                        var single = (typeof(action.single) != undefined && action.single == true) ? 'single' : '';
        				var button = $(actbar).append('<a class="btn btn-mini ' + single + '" title="' + action.label + '" ' + datatag + '><i class="' + action.icon + '"></i></a>').children('a[data-action=' + ind +']');
                    }
                }
                if (!refreshed) {
                    $(actbar).find('div.group:first-child').after('<div class="group"><a class="btn btn-mini" data-refresh title="Refresh"><i class="icon-refresh"></i></a></div>');
                }
                $(actbar).on('click', 'a:not(.disabled)', function(){
                    $(events).trigger('handleAction', [$(this)]);
                });
        	}
            if (jQuery.fn.hasOwnProperty('tooltip')) {
            	$("[data-actions] a[title]").tooltip();
            }
            else if (jQuery.fn.hasOwnProperty('tipsy')) {
                $("[data-actions] a[title]").tipsy();
            }
            applicableAction();
        }
    });
})( jQuery );