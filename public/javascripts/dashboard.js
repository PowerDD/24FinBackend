$(function() {

	if ( $('#numberOrderHistory').length > 0 ) loadCount('member-order_history');

	$(document).on('click', 'a.order_history', function(){
		if ($('#numberOrderHistory').html() != '0') {
			loadOrderHistory();
		}
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
					$('.box.order_history').slideDown();
					var tbody = $('.box.order_history').find('table tbody');
					tbody.html('');
					var html = '';
					for(i=0; i<data.result.length; i++){
						var result = data.result[i];
						html += '<tr><td>'+result.orderNo+'</td>';
						html += '<td class="text-center">'+result.orderDate+'</td>';
						html += '<td>';
						if (!result.active) html += '<span class="label label-default">'+$('#msg_cancel').val()+'</span>';
						else {
							html += '<i class="fa fa-heart text-muted"></i>';
						}
						html += '</td>';
						html += '<td class="text-center">'+result.cnt+'</td>';
						html += '<td class="text-center">'+result.qty+'</td>';
						html += '<td class="text-right">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
					}
					tbody.html(html);
					$('i.text-muted').css('opacity', 0.3);
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}