$(function() {

	if ( $('h3#numberWallet').length > 0 ) loadBadge();

});


function loadBadge() {
	$.post($('#apiUrl').val()+'/member/summary/alert', {
		authKey: $('#authKey').val(),
		screen: 'member-dashboard',
	}, function(data){
			if (data.success) {
				if (data.correct) {
					if (data.result[0].count > 0){
						/*$('#'+name+' .badge').addClass(color).html( numberWithCommas(data.result[0].count) ).show();
						if (name.indexOf('subMenu-') != -1) {
							var parent = $('#'+name+' .badge').parents('.treeview').find('.badge:eq(0)');
							parent.addClass(color).html( numberWithCommas(data.result[0].count+parseInt($.trim(parent.html())) ) ).show();
						}*/
					}
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}