app.controller('historyCtrl',['$http' ,function($http){
	let vm = this;
	vm.data = [];
	vm.sourse = [];
	vm.category = [];
	let lowest_date = true;
	let lowest_sum = true;
	vm.type_id = 0;
	vm.sourse_id = null;
	vm.category_id = null;
	vm.types = [{name: 'All', id: 0}, {name: 'Income', id: 1}, {name: 'Outcome', id: 2}];
	vm.filtered_data = [];
	vm.type_chosen = false;
	vm.sourse_chosen = true;
	vm.category_chosen = true;
	
	vm.send = function(mon){
		var date = new Date();
		var year = date.getFullYear();
		
		$http.get('/get_history?year='+year+'&month='+mon).then(
			res=> {
				vm.data = res.data;
				
				vm.type_id = 0;
				vm.category_id = null;
				vm.sourse_id = null;
				
				vm.filtered_data = [...res.data];
				vm.data.forEach(data => data._formatted_date = (new Date(data._data)).toLocaleDateString());
				
				vm.sourse = [];
				vm.category = [];
				
				var obj_sourse = {};
				for(let i = 0; i < vm.data.length; i++){
					var str = vm.data[i].sourse;
					if (str){
						obj_sourse[str] = true;
					}
				}
				var sourse_key = Object.keys(obj_sourse);
				for(let j = 0; j <= sourse_key.length-1; j++){
					vm.sourse.push({name: sourse_key[j], id: j});
				}
				
				var obj_category = {};
				for(let i = 0; i < vm.data.length; i++){
					var str = vm.data[i].category;
					if (str){
						obj_category[str] = true;
					}
				}
				var category_key = Object.keys(obj_category);
				for(let j = 0; j <= category_key.length-1; j++){
					vm.category.push({name: category_key[j], id: j});
				}
				
			},
			err=> console.log(err)
		)
	}
	vm.send('all');
	
	vm.sort_by_date = function(){
		if(lowest_date){
			vm.data.sort((a, b) => {
				if (a._data > b._data) {
					return -1;
				} if (a._data < b._data) {
					return 1;
				} else {
					return 0;
				}
			})
			lowest_date = false;
		} else{
			vm.data.sort((a, b) => {
				if (a._data < b._data) {
					return -1;
				} if (a._data > b._data) {
					return 1;
				} else {
					return 0;
				}
			})
			lowest_date = true;
		}
	};
	
	vm.sort_by_sum = function(){
		if(lowest_sum){
			vm.data.sort((a, b) => {
				if (a._sum > b._sum) {
					return -1;
				} if (a._sum < b._sum) {
					return 1;
				} else {
					return 0;
				}
			})
			lowest_sum = false;
		} else{
			vm.data.sort((a, b) => {
				if (a._sum < b._sum) {
					return -1;
				} if (a._sum > b._sum) {
					return 1;
				} else {
					return 0;
				}
			})
			lowest_sum = true;
		}
	};

	vm.select_type = () => {
		if (vm.type_id != null){
			if( +vm.type_id === 1 ) {
				vm.data = vm.filtered_data.filter(data => data._type === "Income");
			} else if ( +vm.type_id === 2 ) {
				vm.data = vm.filtered_data.filter(data => data._type === "Outcome");
			} else {
				vm.data = vm.filtered_data.filter(data => true);
			}
		}
		vm.category_id = null;
		vm.sourse_id = null;
	};
	
	vm.select_sourse = () => {
		vm.data = vm.filtered_data.filter(data => data.sourse === vm.sourse[vm.sourse_id].name);
		vm.type_id = null;
		vm.category_id = null;
	};
	
	vm.select_category = () => {
		vm.data = vm.filtered_data.filter(data => data.category === vm.category[vm.category_id].name);
		vm.type_id = null;
		vm.sourse_id = null;
	};
	
}]);