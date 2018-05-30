app.controller('homeCtrl',['$http', 'budgetServices', '$rootScope' ,function($http, budgetServices, $rootScope){
	let vm = this;

	var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;

	vm.saves = [];
	vm.sourse = [];
	vm.category = [];
	vm.flugIncome = false;
	vm.flugSave = false;
	vm.incomeQuery = {};
	vm.outcomeData = {};
	vm.hintMessage = '';
	
	const get_category_sum = () => {
		$http.get('get_outcome_home?year='+year+'&month='+month).then(
			res=> {
				for(let i = 0; i < vm.category.length; i++){
					vm.category[i]._sum = 0;
					
					for(let j = 0; j < res.data.length; j++){
						if (res.data[j].category_id == vm.category[i].id){
							vm.category[i]._sum += res.data[j]._sum;
						}
					}
				}
			},
			err => console.log(err)
		)
	}

	$http.get('/get_home').then(
		res=>{
			vm.saves = res.data.saves;
			vm.sourses = res.data.sourse;
			vm.category = res.data.category;
			get_category_sum();
		},
		err=>console.log(err)
	)

	// income query code
	vm.activeBtnIncome = false;
	vm.makeAnAttach = function(){
		vm.activeBtnIncome = true;
		vm.flugIncome = true;
	}

	vm.sendIncome = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		vm.flugIncome= false;
		vm.activeBtnIncome = false;
		$http.post('/add_incomes', vm.incomeQuery).then(
			res=>{
				budgetServices.getBudget();
				vm.hintMessage = 'Кошти успішно добавлено на рахунок!';
				$http.get('/get_saves_home').then(
					res=>vm.saves = res.data,
					err=>console.log(err)
				)
			},
			err=>console.log(err)
		)
		vm.incomeQuery = {};
	}

	vm.cancelIncome = function(){
		vm.flugIncome = false;
		vm.activeBtnIncome = false;
		vm.incomeQuery = {};
	}

	// outcome query code
	vm.isSelected = function(data){
		return vm.selected === data;
	}

	vm.activeCategory = function(data){
		vm.outcomeData.category_id = data.id;
		if (vm.selected === data) {
			vm.selected = false;
			vm.outcomeData = {};
		}else {
			vm.selected = data;
		}
	}

	vm.activeSave = function(data){
		if (vm.selected) {
			vm.flugSave = true;
			vm.outcomeData.save_name = data._name;
			vm.outcomeData.saves_id = data.id;
			vm.outcomeData.save_sum = data._sum;
		}else {
			vm.hintMessage = 'Виберіть будь ласка категорію!';
		}
		
	}

	vm.sendOutcome = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		if (vm.outcomeData._sum <= vm.outcomeData.save_sum) {
			$http.post('/add_outcomes', vm.outcomeData).then(
				res=>{
					budgetServices.getBudget();
					vm.selected = false;
					vm.flugSave = false;
					vm.hintMessage = 'Кошти успішно знято з рахунку ' + vm.outcomeData.save_name;	
					vm.outcomeData = {};
					var outcome_sum = [];
					get_category_sum();
					$http.get('/get_saves_home').then(
						res=>vm.saves = res.data,
						err=>console.log(err)
					)
				},
				err=>{
					console.log(err);
					vm.outcomeData = {};
					vm.selected = false;
					vm.flugSave = false;
				}
			)
		}else {
			vm.outcomeData = {};
			vm.flugSave = false;
			vm.selected = false;
			vm.hintMessage = 'Недостатньо коштів!Виберіть інший рахунок!';	
		}
	}

	vm.cancelOutcome = function(){
		vm.selected = false;
		vm.flugSave = false;
		vm.outcomeData = {};
	}

}]);