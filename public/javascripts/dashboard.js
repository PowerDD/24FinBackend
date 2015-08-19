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
					var sumPrice = 0;
					for(i=0; i<data.result.length; i++){
						var result = data.result[i];
						html += '<tr><td>'+result.orderNo+'</td>';
						html += '<td class="text-center">'+result.orderDate+'</td>';
						html += '<td>';
						if (!result.active) html += '<span class="label label-default">'+$('#msg-cancel').val()+'</span>';
						else {
							html += '<i class="fa fa-lg pointer fa-bitcoin show-tooltip '+((result.isPay) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val())+'"></i>';
							html += ' <i class="fa fa-lg pointer fa-cube show-tooltip '+((result.isPack) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val())+'"></i>';
							if ( !result.isPay ) {
								html += '<span class="label label-default">'+$('#msg-awaiting_payment').val()+'</span>';
							}
							else if ( result.isPay && !result.isPack ) {
								html += '<span class="label label-default">'+$('#msg-awaiting_stock').val()+'</span>';
							}
						}
						html += '</td>';
						html += '<td class="text-center">'+result.cnt+'</td>';
						html += '<td class="text-center">'+result.qty+'</td>';
						html += '<td class="text-right">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
						sumPrice += result.totalPrice;
					}
					html += '<tr><td colspan="5">Total</td><td class="text-right">'+numberWithCommas(sumPrice.toFixed(0))+'</td></tr>';
					tbody.html(html);
					$('.show-tooltip').tooltip();
					$('i.text-muted').css('opacity', 0.3);
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}