(function( $ ){
    $.extend($.fn, {
        intelligrid: function(settings){
        	var table = this;
        	var actbar = {};
        	var actions = (typeof settings.actions != undefined) ? settings.actions : null;
        	if (!actions) {
        		// No actions were defined.
        	}
        	else {
	        	$(this).children('thead').children('tr').children('th:first-child').before('<th></th>');
	        	$(this).children('tbody').find('tr').each(function(){
	        		$(this).find('td:first-child').before('<td></td>');
	        	});
	        	var actbar = $(this).before('<div data-actions></div>').parent().find('div[data-actions]');
        		
        		$(actbar).append('<a class="btn btn-mini">Select All</a><a class="btn btn-mini">Select None</a>');
        		if (actions) {
        			for (ind in actions) {
        				var action = actions[ind];
        				$(actbar).append('<a class="btn btn-mini" title="' + action.label + '"><i class="' + action.icon + '"></i></a>');
        			}
        		}
        	}
        	$("[data-actions] a[title]").tooltip();
        }
    });
})( jQuery );