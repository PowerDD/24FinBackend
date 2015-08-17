var currentDate = new Date();

$(function() {	

	loadOrder(currentDate.getFullYear(),currentDate.getMonth()+1);

	$(document).on('click', '#ul-month li', function(){
		$('#ul-month li.active').removeClass('active');
		$(this).addClass('active');
		currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - parseInt($(this).data('month')));
		loadOrder(currentDate.getFullYear(), parseInt(currentDate.getMonth())+1);
		//loadOrder();
	});

});

function loadOrder(year, month){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post($('#apiUrl').val()+'/order/summary/month', {
		authKey: $('#authKey').val(),
		year: year,
		month: month,
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {
			if (data.correct) {
				var html = '';
				var sumPrice = 0;
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<tr><td class="text-center'+((!result.active) ? ' msg_erase' : '')+((!result.isPack && result.active) ? ' text-red font-bold' : '')+'">'+result.orderNo+'</td>';
					var sp = result.orderDate.split(' ');
					var date = sp[0].split('-');
					html += '<td class="text-center" nowrap="nowrap">'+date[2]+'-'+date[1]+'-'+(parseInt(date[0])+543)+' '+sp[1]+'</td>';
					html += '<td class="status" width="50">';
					html += '<i class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val())+'"></i>';
					html += ' <i class="fa pointer fa-cube show-tooltip '+((result.isPack) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val())+'"></i>';
					html += '</td>';
					html += '<td class="action" width="50"><a href="https://24fin-api.azurewebsites.net/report/order4office/1/'+result.orderNo+'"><i class="fa pointer fa-cloud-download"></i></a>';
					html += ' <a href="https://24fin-api.azurewebsites.net/report/envelope/1/'+result.orderNo+'"><i class="fa pointer fa-envelope"></i></a>';
					html += '</td>';
					html += '<td>'+result.firstname+' '+result.lastname+'</td>';
					html += '<td>'+result.shopName+'</td>';
					html += '<td class="text-right '+((result.isPay) ? 'text-red font-bold' : 'text-muted')+'">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
					html += '</tr>';
					sumPrice += (result.isPay) ? result.totalPrice : 0;
				}
				$('#tb-result tbody').html( html );
				$('.sp-Income').html( numberWithCommas(sumPrice.toFixed(0)) );
				$('.show-tooltip').tooltip();
				$('i.text-muted').css('opacity', 0.3);
				$('.wait').show();
				if (data.result.length == 0)
				{
					$('#dv-no_data').show();
					$('#tb-result').hide();
				}
			}
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}