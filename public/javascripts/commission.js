$(function() {

	loadTeamworkName();

	$(document).on('change', '#select-type', function(){
		renderData();
	});

	$(document).on('click', '#ul-month li', function(){
		$('#ul-month li.active').removeClass('active');
		$(this).addClass('active');
		renderData();
	});

	$(document).on('click', '#tb-result .orderNo', function(){
		$('tr.selected').removeClass('selected');
		$(this).parents('tr').addClass('selected');
		$('.sp-title').html( $(this).html() );
		loadDetail( $(this).html() );
	});

});


function loadTeamworkName(){
	$.post($('#apiUrl').val()+'/member/teamwork/data', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				if (data.correct) {
					for( i=0; i<data.result.length; i++ ) {
						var result = data.result[i];
						if ( result.memberType == 'headSale' ) {
							$('#og-headSale').append('<option data-type="headSale" value="'+result.id+'">'+result.name+'</option>');
						}
						else if ( result.memberType == 'sale' ) {
							$('#og-sale').append('<option data-type="sale" value="'+result.id+'">'+result.name+'</option>');
						}
						else if ( result.memberType == 'dealer' ) {
							$('#og-dealer').append('<option data-type="dealer" value="'+result.id+'">'+result.name+'</option>');
						}
					}
					if ( $('#og-headSale option').length == 0 ) $('#og-headSale').remove();
					if ( $('#og-sale option').length == 0 ) $('#og-sale').remove();
					if ( $('#og-dealer option').length == 0 ) $('#og-dealer').remove();
					loadData();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function loadData(){
	$.post($('#apiUrl').val()+'/member/commission/summary', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				if (data.correct) {
					var html = '';
					for( i=0; i<data.result.length; i++ ) {
						var result = data.result[i];
						html += '<tr class="'+((result.month == 0) ? 'selected' : 'hidden')+' month-'+result.month+'">';
						html += '<td><span class="orderNo text-info pointer" data-toggle="modal" data-target="#dv-detail">'+result.orderNo+'</span></td>';
						html += '<td class="status">';
						html += '<i class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val())+'"></i>';
						html += ' <i class="fa pointer fa-cube show-tooltip '+((result.isPack) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val())+'"></i>';
						html += '</td>'
						html += '<td class="dealer dealer-'+result.dealerCode+'" data-id="'+result.dealerCode+'">'+result.dealer+'</td>';
						if ( result.headSaleCode != undefined ) {
							$('#tb-result thead .headSale').show();
							html += '<td class="headSale headSale-'+result.headSaleCode+'" data-id="'+result.headSaleCode+'">'+result.headSale+'</td>';
						}
						else {
							$('#tb-result thead .headSale').show();
							html += '<td class="headSale headSale-" data-id="">-</td>';
						}
						if ( result.saleCode != undefined ) {
							$('#tb-result thead .sale').show();
							html += '<td class="sale sale-'+result.saleCode+'" data-id="'+result.saleCode+'">'+result.sale+'</td>';
						}
						else {
							$('#tb-result thead .sale').show();
							html += '<td class="sale sale-" data-id="">-</td>';
						}
						html += '<td class="price text-right">'+numberWithCommas(result.price.toFixed(0))+'</td>';
						html += '<td class="text-right">'+result.discount+'%</td>';
						html += '<td class="totalPrice text-right">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
						html += '<td class="income text-right '+((result.isPay) ? 'text-red font-bold' : 'text-muted')+'" data-income="'+result.income+'">'+((result.income > 0) ? numberWithCommas(result.income) : '-')+'</td>';
						html += '</tr>';
					}
					$('#tb-result tbody').html(html);
					$('.show-tooltip').tooltip();
					$('i.text-muted').css('opacity', 0.3);
					$('.hidden').removeClass('hidden').hide();
					$('.wait').show();
					$('#dv-loading').hide();
					calculateIncome();
				}
				else {
					$('#dv-loading').hide();
					$('#dv-no_data').show();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function calculateIncome(){
	var sum = 0;
	$('#tb-result tbody tr.selected .text-red').each(function(){
		sum += parseInt($(this).data('income'));
	});
	$('.sp-Income').html( numberWithCommas(sum.toFixed(2)) );
}

function renderData(){
	$('#tb-result tbody tr').hide();
	$('#tb-result tbody tr.selected').removeClass('selected');

	if ( $('#select-type :selected').data('type') == 'all' ) {
		$('#tb-result tbody tr.month-'+$('#ul-month .active').data('month')).addClass('selected').show();
	}
	else {
		$('.'+$('#select-type :selected').data('type')+'-'+$('#select-type :selected').val()).parents('tr.month-'+$('#ul-month .active').data('month')).addClass('selected').show();
	}

	calculateIncome();
}


function loadDetail( orderNo ){
	$.post($('#apiUrl').val()+'/member/commission/detail', {
		authKey: $('#authKey').val(),
		orderNo: orderNo,
	}, function(data){
			if (data.success) {
				if (data.correct) {
					var html = '';
					var sumQty = 0;
					var sumManager = 0;
					var sumHeadSale = 0;
					var sumSale = 0;
					for( i=0; i<data.result.length; i++ ) {
						var result = data.result[i];
						sumQty += result.qty;
						html += '<tr>';
						html += '<td>'+result.name+'</td>';
						html += '<td class="text-right">'+numberWithCommas(result.qty)+'</td>';
						html += '<td class="text-right">'+numberWithCommas(result.price)+'</td>';
						html += '<td class="text-right">'+numberWithCommas(result.discount)+'%</td>';
						html += '<td class="text-right font-bold text-green">'+numberWithCommas(result.totalPrice.toFixed(2))+'</td>';
						if ( result.managerCost != undefined ) {
							sumManager += result.managerIncome*result.qty;
							$('#tb-result_detail thead .role-manager').show();
							html += '<td class="text-right">'+numberWithCommas(result.managerCost)+'</td>';
							html += '<td class="text-right font-bold">'+((result.managerIncome > 0) ? numberWithCommas(result.managerIncome.toFixed(0)) : '-')+'</td>';
							html += '<td class="text-right font-bold text-red">'+((result.managerIncome > 0) ? numberWithCommas((result.managerIncome*result.qty).toFixed(0)) : '-')+'</td>';
						}
						if ( result.headSaleCost != undefined ) {
							sumHeadSale += result.headSaleIncome*result.qty;
							$('#tb-result_detail thead .role-headSale').show();
							html += '<td class="text-right">'+numberWithCommas(result.headSaleCost)+'</td>';
							html += '<td class="text-right font-bold">'+((result.headSaleIncome > 0) ? numberWithCommas(result.headSaleIncome.toFixed(0)) : '-')+'</td>';
							html += '<td class="text-right font-bold text-red">'+((result.headSaleIncome > 0) ? numberWithCommas((result.headSaleIncome*result.qty).toFixed(0)) : '-')+'</td>';
						}
						if ( result.saleCost != undefined ) {
							sumSale += result.saleIncome*result.qty;
							$('#tb-result_detail thead .role-sale').show();
							html += '<td class="text-right">'+numberWithCommas(result.saleCost)+'</td>';
							html += '<td class="text-right font-bold">'+((result.saleIncome > 0) ? numberWithCommas(result.saleIncome.toFixed(0)) : '-')+'</td>';
							html += '<td class="text-right font-bold text-red">'+((result.saleIncome > 0) ? numberWithCommas((result.saleIncome*result.qty).toFixed(0)) : '-')+'</td>';
						}
						html += '</tr>';
					}
					$('#tb-result_detail tbody').html(html);
					html = '<tr>';
					html += '<td class="text-right">'+$('#msg-total').val()+'</td><td class="text-right">'+numberWithCommas(sumQty)+'</td>';
					html += '<td colspan="3"></td>';
					if ($('#tb-result_detail thead .role-manager').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">'+((sumManager > 0) ? numberWithCommas(sumManager.toFixed(2)) : '-')+'</td>';
					if ($('#tb-result_detail thead .role-headSale').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">'+((sumHeadSale > 0) ? numberWithCommas(sumHeadSale.toFixed(2)) : '-')+'</td>';
					if ($('#tb-result_detail thead .role-sale').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">'+((sumSale > 0) ? numberWithCommas(sumSale.toFixed(2)) : '-')+'</td>';
					html += '</tr>';
					$('#tb-result_detail tbody').append(html);
				}
				else {
					$('#tb-result_detail tbody').html('');
					//$('#dv-loading').hide();
					//$('#dv-no_data').show();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}