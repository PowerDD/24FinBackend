$(function() {

	if ( $('#numberOrderHistory').length > 0 ) loadCount('member-order_history');

	$(document).on('click', 'a.order_history', function(){
		loadOrderHistory();
	});

});


function loadCount( screen ) {
	$.post($('#apiUrl').val()+'/member/summary/alert', {
		authKey: $('#authKey').val(),
		screen: screen,
	}, function(data){
			if (data.success) {
				if (data.correct) {
					if (data.result[0].count > 0){
						$('#numberOrderHistory').html( data.result[0].count );
					}
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function loadOrderHistory() {
	$.post($('#apiUrl').val()+'/member/order/header', {
		authKey: $('#authKey').val(),
		screen: 'member-order_history',
	}, function(data){
			if (data.success) {
				if (data.correct) {
					if (data.result[0].count > 0){
						//$('#numberOrderHistory').html( data.result[0].count );
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