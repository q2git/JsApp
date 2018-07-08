'use strict';

angular.module('myApp')

	//.constant("baseURL","http://192.168.0.128:5000/") //moved to configs.js
	//.constant("baseURL","http://127.0.0.1:5000/")

	//myCtrl****************************************************	
	.controller('myCtrl', ['$scope', '$interval', '$filter','mySvc', function($scope, $interval, $filter, mySvc) {  
		$scope.message = "Loading ...";
		$scope.showData = false;
		//$scope.currPage = 1; //moved into function querydata
		//$scope.cntPages = 1;
		$scope.formData = {};
		$scope.dateTime = $filter('date')(Date.now(),'yyyy-MM-dd HH:mm:ss'); ;
		$interval(function(){$scope.dateTime=$filter('date')(Date.now(),'yyyy-MM-dd HH:mm:ss');}
					,1000); //refresh dateTime automatically
		$scope.temp = 'for degbug' ;//for debug
		
		//database operation: Read
		//http://127.0.0.1:5000/cn?q={"filters":[{"name":"field0","op":"eq","val":5}]}
		//http://127.0.0.1:5000/cn?page=1&q={"filters":[{"name":"field0","op":"eq","val":5}]}
/* 			var querydata = function(param){
			mySvc.dbData(param).get(
				function(response) {
					$scope.dbItems = response;//response["objects"],dbItems.objects;					
					$scope.cntFields = Object.keys(response["objects"][0]).length; //get the count of fields
					$scope.showData = true;
					$scope.cntPages = $scope.dbItems.total_pages;
					//console.log("test");
				},
				function(response) {
					$scope.message = response;//"Error: "+response.status + " " + response.statusText;
				});
			};
		 */	
		var querydata = function(param){
			// asynchronous method (same as above)
			mySvc.dbData(param).get().$promise.then(
				function(response){
					$scope.dbItems = response;//response["objects"],dbItems.objects;					
					$scope.cntFields = Object.keys(response["objects"][0]).length; //get the count of fields
					$scope.showData = true;
					$scope.cntPages = $scope.dbItems.total_pages;
					$scope.currPage = 1;
					console.log("GET, data");
				},
				function(response) {
					$scope.showData = false;
					$scope.message = "Error: "+response.status + " " + response.statusText;

				})
			};			 					 
					
		//database operation: addNew
		var AddNew = function (action) {
			$scope.formData.field1 = $scope.dateTime;
			console.log($scope.formData);
			var dbResource = mySvc.dbData('');
			if (confirm("Are you sure to add it?")){	
				dbResource.save( 
					$scope.formData,
					function(response) {
						console.log('POST, addNew');
						$scope.dbItems.objects.splice(0, 0, response); //response is the new dbItem returned from server
						//$scope.dbItems.objects.push(response); 
						console.log($scope.dbItems.objects);
						//querydata();
					},
					function(response) {
						$scope.showData = false;
						$scope.message = "Error: "+response.status + " " + response.statusText;
					}
				);
			};
		};				
		
		//database operation: modify(update)
		var Modify = function (action) {
			console.log($scope.formData);
			var dbResource = mySvc.dbData('');
			if (confirm("Are you sure to update it?")){	
				dbResource.update( //.update = {'update':{method:'PUT'}}, see mySvc
					$scope.formData,
					function(response) {
						console.log('PUT, Modify');
						//querydata();
					},
					function(response) {
						// console.log('POST, addnew');
						// dbResource.save({'field0':''},$scope.formData);
						// querydata();
						$scope.showData = false;
						$scope.message = "Error: "+response.status + " " + response.statusText;
					}
				);
			};
		};			
		
		//database operation: delete
		$scope.del = function (item, idx) {
			console.log(item, idx);
			if (confirm("Are you sure to delete it?")){
				mySvc.dbData('').remove({'kwd':item});
				//mySvc.dbData('').delete({'kwd':item});
				$scope.dbItems.objects.splice(idx, 1); //remove idx from array
				$scope.formData = null; //clear formData
				//querydata();
			};
		};
				
		//clean myForm
		$scope.formClean = function(){
			angular.forEach($scope.formData, function(data,index,array){
				//$scope.formData[index] = null;
				//console.log('data=',data,'\nindex=',index,'\narray=',array);
				array[index]=null;
			});	
			querydata(); //formClean will effect myTable, so refresh it.
		};
		
		//submit form
		var submitForm = function (n) {
			//var n;
			//($scope.formData.field0==null) ? n=1 : n=2;	
			switch(n)
			{
				case 'AddNew':
					AddNew();
					break;
				case 'Modify':
					Modify();
					break;
				case 3:
					break;					
				default:
					//n 与 case 1 和 case 2 不同时执行的代码
			};
		};
		
		//pagination
		$scope.getPage = function(pg) {
			if(pg>$scope.cntPages){pg=1;};
			if(pg<1){pg=$scope.cntPages;};
			var p = '?page=' + pg + '&q={"order_by":[{"field":"field0", "direction":"desc"}]}';
			$scope.dbItems = mySvc.dbData(p).get();
			$scope.showData = true;
			$scope.currPage = pg;
		};
			
		//initial data loading
		querydata();
		console.log($scope.formData);
		
		//sorting data by click
		$scope.sortBy = function(key){
			$scope.sortby = '+'+key;
		};
		
		//update formData
		$scope.updateForm = function(item){
			$scope.formData = item
			//console.log(item);
		};				

		//form validation -- Shorthand Validation
/* 		$('.ui.form')
		  .form({
			fields: {
			  todo     : 'empty',
			  psw : ['minLength[6]', 'empty'],
			  ckb    : 'checked'
			}
		  }); */	
		//form validation -- Full Validation
		$('#myForm') //$('.myform'), #=id,.=class
		  .form({
			fields: {
			  field0: {
				identifier: 'todo',
				rules: [
				  {
					type   : 'empty',
					prompt : 'Empty value in {name} is not allowed'
				  }
				]
			  },
			  sexfs: {
				identifier: 'sex',
				rules: [
				  {
					type   : 'empty',
					prompt : 'Please select a gender'
				  }
				]
			  },
			  password: {
				identifier: 'psw',
				rules: [
				  {
					type   : 'empty',
					prompt : 'Please enter a password'
				  },
				  {
					type   : 'minLength[6]',
					prompt : 'Your password must be at least {ruleValue} characters'
				  }
				]
			  },
			  checkbox: {
				identifier: 'ckb',
				rules: [
				  {
					type   : 'checked',
					prompt : '{name} must be checked'
				  }
				]
			  }
			},
			inline : true,  //This example also uses a different validation event. 
			on     : 'blur', //Each element will be validated on input blur instead of the default form submit.
			
			onSuccess: function(){ //https://semantic-ui.com/behaviors/form.html#/settings
				//alert('success');
				submitForm(event.target.innerText);
			},
			onFailure:  function(){
				console.log('onFailure',event.target.innerText, event.target.name );
			}			
		  });
		  
	}])
	
	//mySvc****************************************************	
	.service('mySvc', ['$resource', 'baseURL', function($resource,baseURL) {
		this.dbData = function(args){
			
			if(args==null){
				args='?q={"order_by":[{"field":"field0", "direction":"desc"}]}';
				};
				
			return $resource(baseURL+'cn'+args+'/:kwd',{'kwd':'@field0'},{'update':{method:'PUT'}});
		};		
	}])
		
;		




