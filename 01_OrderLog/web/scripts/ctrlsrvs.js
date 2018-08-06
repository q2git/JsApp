'use strict';

angular.module('myApp')

	.constant("baseURL","http://127.0.0.1:5000/")

	//myCtrl****************************************************	
	.controller('myCtrl', ['$scope', '$filter', '$interval', '$location', 'mySvc', 
				  function($scope, $filter, $interval, $location, mySvc) {  
		$scope.message = "Loading ...";
		$scope.showMsg = false;
		$scope.orderInfo = {};
		$scope.dbResponse = null;
		var orderStatus = 0;

		//for accessing form remote computer,eg:192.168.x.x, restsrv port+1 
		var url; 
		url = $location.host()=="" ? null : "http://"+$location.host()+":"+(Number($location.port())+1)+"/";
		//console.log('url', url);			
			
		//database operation: addNew
		var AddNew = function (action) {
			$scope.showMsg = false;				
			var dbResource = mySvc.dbData('', url);
			if (confirm("Are you sure to add it?")){	
				dbResource.save(
					{'kwd':''},
					$scope.orderInfo,
					function(response) {						
						$scope.dbResponse = response;
						setForm(3);
						console.log('POST, addNew', response);							
					},
					function(response) {
						$scope.message = "Error: "+response.status + " " + response.statusText;
						$scope.showMsg = true;								
					}
				);
			};
		};				
		
		//database operation: modify(update)
		var Modify = function (order) {	
			$scope.showMsg = false;			
			var dbResource = mySvc.dbData('', url);
			if (confirm("Are you sure to update it?")){	
				dbResource.update( //.update = {'update':{method:'PUT'}}, see mySvc
					{'kwd':order},
					$scope.orderInfo,
					function(response) {
						$scope.dbResponse = response;
						setForm(3);
						console.log('PUT, Modify',response);							
					},
					function(response) {
						$scope.message = "Error: "+response.status + " " + response.statusText;
						$scope.showMsg = true;								
					}
				);
				console.log('Modified',order);
			};
		};	

		//check the Order if it already exists in database, then add or modify it.
		var updateOrder = function(order){
			if(order==''){return;};
			
			var pName = $('#Proc').val();
			$scope.showMsg = false;	
			$scope.dbResponse = null;	

			$scope.orderInfo["Order"] = $('#Order').val();			
			$scope.orderInfo[pName+'_OverDueReason'] = $('#Overdue').val();
			if($('#Aloss').val()!=''){
				$scope.orderInfo[pName+'_Aloss'] = $('#Aloss').val();
			};
			if($('#Repair').val()!=''){			
				$scope.orderInfo[pName+'_Repair'] = $('#Repair').val();
			};			
			if($('#Scrap').val()!=''){			
				$scope.orderInfo[pName+'_Scrap'] = $('#Scrap').val();
			};
			
			mySvc.dbData('/'+order, url).get(
				function(response) { //order existed in db					
					$scope.dbResponse = response;
					setForm(1);		
					delete $scope.orderInfo.Order;
					if(orderStatus){
						$scope.orderInfo[pName+'_FinishDate'] = $filter('date')(Date.now(),'yyyy-MM-dd HH:mm:ss'); 
					};
					Modify(order);					
				},
				function(response) { //order not existed in db
					setForm(2);
					$scope.message = "Error: "+response.status + " " + response.statusText;					
					if(response.status==404){
						var pArr = ['CP', 'SMT', 'THT', 'ICT', 'FT', 'FA'];
						pArr = pArr.slice(0, pArr.indexOf(pName)+1);
						//console.log(pArr);
						for(var i in pArr){
							$scope.orderInfo[pArr[i]+"_FinishDate"] = '1900/01/01';
						};
						if(orderStatus){
							$scope.orderInfo[pName+'_FinishDate'] = $filter('date')(Date.now(),'yyyy-MM-dd HH:mm:ss'); 
						};
						AddNew();						
					}else{
						$scope.showMsg = true;
					};							
				});
			console.log("update Order",$scope.orderInfo);
			};	
			
		//set form
		var setForm = function(n){		
			switch(n)
			{
				case 1: //check ok 
					$('.ui.statistic.segment').removeClass('red green').addClass('violet');
					//$('#Overdue').val($scope.dbResponse[$('#Proc').val()+'_OverDueReason']);
					//$('#Aloss').val($scope.dbResponse[$('#Proc').val()+'_Aloss']);
					//$("[name='Repair']").val($scope.dbResponse[$('#Proc').val()+'_Repair']);
					//$("input[name='Scrap']").val($scope.dbResponse[$('#Proc').val()+'_Scrap']);
					break;
				case 2: //check ng
					$('.ui.statistic.segment').removeClass('green violet').addClass('red');
					break;
				case 3: //add & update ok
					$('.ui.statistic.segment').removeClass('red violet').addClass('green');
					$('#Order').val('');
					$('#Overdue').val('');
					$('.btnOver .ui.button').removeClass('primary');				
					$("[name='Aloss']").val('');
					$("[name='Repair']").val('');
					$("input[name='Scrap']").val('');
				default:
				//n 与 case 1 和 case 2 不同时执行的代码
			}
			console.log('setForm');
		};		
		
		//Semantic-UI codes*********************		
		$(document).ready(function() {				
				
			$(".ui.toggle")
				.click(function(){
					$(this).toggleClass("active");
					$(this).text($(this).text() == "CLOSED" ? "PENDING" : "CLOSED");
					orderStatus = orderStatus == 0 ? 1 : 0;
					$('#Status').val( orderStatus == 0 ? 'PENDING' : ''); //hidden field for overduereason validation
					//$(this).children("i").toggleClass("outline");
					//$(this).children("i").removeClass(orderStatus == 0 ? 'smile' : 'frown')
					//					 .addClass(orderStatus == 0 ? 'frown' : 'smile');
					$('#ScanInput').focus();					 
			});			
			
			//select all text of a input on focus
			$("input:text")
				.focus(function(){
					$(this).select();
			});	
			
			$('#ScanInput')
				.on('change', function() {	
					$('#Order').val($(this).val().substr(0, 7)); //.trigger('change'); 
					$('.form').submit();
					$(this).val('');
					$(this).select();					
					console.log('#ScanInput',$(this).val());
			});								

			$('.ui.buttons .ui.button')
				.on('click', function() {
					$(this)
						.addClass('primary')
						.siblings()
						.removeClass('primary')
						;	
					$('#ScanInput').focus();	
			});
			
			$('.btnProc .ui.button')
				.on('click', function() {							  
					$('#Proc').val($(this).text()); 
			});
			
			$('.btnOver .ui.button')
				.on('click', function() {						
					if($(this).val()=="other"){
						$('#Overdue')
							.focus()
							.val("")
							.removeAttr("readonly");
					}else{
						$('#Overdue')
							.val($(this).text())
							.attr("readonly","readonly");						
					};
			});					  				  
		
			});	

		//form validation -- Shorthand Validation
 		$('.ui.form')
		.form({
			fields: {
				Order: {
					identifier: 'Order',
					rules: [{type   : 'integer',},
							{type   : 'length[7]',},
							{type   : 'maxLength[7]',}]
				},				
				Proc: {
					identifier: 'Proc',
					rules: [{type   : 'empty',}]
				},			  			  
				Overdue: {
					identifier: 'Overdue',
					depends    : 'Status',
					rules: [{type   : 'empty',}]
				},			  
				Aloss: {
					identifier: 'Aloss',
					optional   : true,
					rules: [{type   : 'integer',}]
				},			  
				Repair: {
					identifier: 'Repair',
					optional   : true,
					rules: [{type   : 'integer',}]
				},			  
				Scrap: {
					identifier: 'Scrap',
					optional   : true,
					rules: [{type   : 'integer',}]
				},		  
			},
			//inline : true,  //This example also uses a different validation event. 
			on     : 'submit', //Each element will be validated on input blur instead of the default form submit.
			
			onSuccess: function(){ //https://semantic-ui.com/behaviors/form.html#/settings
				console.log("form onSuccess:");
				updateOrder($('#Order').val());
			},
			onFailure:  function(){
				console.log('form onFailure');
			}			
					
		}); 

		//check restsrv and show Loader if it's not ready							
		//$('.modal').modal('show');		
		var timer = $interval(function () {
			if(mySvc.chkSrv(url)){
				stopTimer();
				$('.dimmer').removeClass('active');	
			};
		}, 2000);  
		var stopTimer = function () {
			$interval.cancel(timer);
		}			
		
	}])

	//custome filter
	.filter('kwd', function() {
	  return function(items, kwd) {
			var result = {};
			angular.forEach(items, function(value, key) {
				if (key.indexOf(kwd) != -1) {
					result[key] = value;
				}
			});
			return result;
		};
	})	
	
	//mySvc****************************************************	
	.service('mySvc', ['$resource', 'baseURL', function($resource,baseURL) {
		var rst = false;
		this.chkSrv = function(url){
			if(url!=null){baseURL = url;};
			$resource(baseURL).get(
				function(response){
					rst = response.hasOwnProperty('objects');
				},
				function(response){
					rst = response.hasOwnProperty('objects');
				}
			);
			return rst;
		};
		
		this.dbData = function(args, url){
			if(url!=null){baseURL = url;};		
			//console.log('baseURL', baseURL);			
			return $resource(baseURL+'cn'+args+'/:kwd',{'kwd':'@Order'},{'update':{method:'PUT'}});
		};		
	}])
		
;		



