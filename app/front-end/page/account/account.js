app.controller('accountCtrl', ['$http', '$location', '$rootScope' ,function($http, $location, $rootScope){
	let vm = this;
	vm.profile = {};
	vm.flugUpdate = true;
	vm.photo = {img:''}
	vm.sourseFlug = false;
	vm.nameBtn = 'Edit';
	$rootScope.userImg = '';
	vm.saves = [];
	vm.category = [];
	vm.sourse = [];
	vm.icons = [];
	vm.hintMessage = '';
	vm.openIcons = false;
	var currentField = {};
	vm.currentIcon = {};


	vm.onInit = function(){
		$http.get('/get_profile').then(
			res=>{
				var user = res.data.user[0];
				vm.sourse = res.data.sourse;
				vm.category = res.data.category;
				vm.saves = res.data.saves;
				vm.filtered_icons = res.data.icons;
				vm.profile.fname = user.first_name;
				vm.profile.lname = user.last_name;
				vm.profile.age = user.age;
				$rootScope.userImg = user.img == '' ? null : 'data:image/png;base64,' + user.img;
			},
			err=>console.log(err)
		)
	}
	vm.onInit();

	vm.userFlug = false;
	vm.deleteProfile = function(){
		vm.userFlug = true;
	}

	vm.cancalDeleteUser = function(){
		vm.userFlug = false;
	}

	vm.confirmDeleteUser = function(){
		$http.delete('/delete_user').then(
			res=>{
				vm.userFlug = false;
				$location.path('/login');
			},
			err=>console.log(err)
		)
	}

	vm.updateProfile = function(){
		vm.nameBtn = 'Send';
		if (!vm.flugUpdate) {
			vm.nameBtn = 'Edit';
			$http.put('/update_profile', vm.profile).then(
				res=>{
					vm.hintMessage = 'Успішно оновлено!';
				},
				err=>console.log(err)
			)
		}
		vm.flugUpdate = !vm.flugUpdate;
	}

	vm.cancelEdit = function(){
		vm.flugUpdate = true;
		vm.nameBtn = 'Edit';
	}

	vm.updatePhoto = function(){
		if (vm.photo.img) {
			$http.put('/update_photo', vm.photo).then(
				res=>{
					$rootScope.userImg = 'data:image/png;base64,' + vm.photo.img.base64;
					vm.hintMessage = 'Успішно оновлено!';
					vm.photo.img = '';
				},
				err=>{
					$rootScope.userImg = '';
					vm.hintMessage = 'Невдалось завантажити!';
					vm.photo.img = '';
				}
			)

		}else {
			vm.hintMessage = 'Виберіть фото!';
		}
	}

	
	vm.editIcon = function(data){
		currentField = data;
		
		if('_sum' in data){
			currentField.field = 'saves';
			vm.icons = vm.filtered_icons.filter(data => data._type == 'saves');
		} else {
			currentField.field = 'category';
			vm.icons = vm.filtered_icons.filter(data => data._type == 'category');
		}
		
		vm.openIcons = true;
	}
	
	vm.confirmAddIcon = function(){
		var id_field = currentField.id;
		var id_icon = vm.currentIcon.id;
		var field = currentField.field;
		$http.put('/edit_icon', {id_field: id_field, id_icon: id_icon, field: field}).then(
			res => {
				$http.get('/get_table?field=' + field).then(
					res=>{
						if (field == 'category'){
							vm.category = res.data;
						} else {
							vm.saves = res.data;
						}
						vm.currentIcon = {};
						vm.openIcons = false;
						vm.hintMessage = 'Успішно збережено!';
					},
					err=>console.log(err)
				)
			},
			err => console.log(err)
		)
	}
	
	vm.currentSourse = {};
	vm.editSourse = function(data){
		vm.currentSourse = angular.copy(data);
	}

	vm.saveSourse = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		if (vm.currentSourse.id) {
			$http.put('/update_sourse', vm.currentSourse).then(
			res=>{
				var index = vm.sourse.findIndex(e=>e.id==vm.currentSourse.id);
            	vm.sourse.splice(index, 1, vm.currentSourse);
            	vm.currentSourse = {};
            	vm.hintMessage = 'Успішно оновлено!';
			},
			err=>console.log(err)
		)
		}else {
			if (vm.currentSourse._name) {
				$http.post('/create_sourse', vm.currentSourse).then(
					res=>{
						$http.get('/get_table?field=' + 'sourse').then(
							res=>{
								vm.sourse = res.data;
								vm.hintMessage = 'Успішно збережено!';
							},
							err=>console.log(err)
						)
						vm.currentSourse = {};
					},
					err=>console.log(err)
				)
			}else {
				vm.hintMessage = 'Потрібно заповнити поле!';
			}
		}
	}

	vm.deleteSourse = function(sourse){
		$http.put('/delete_sourse', {id: sourse.id}).then(
			res=>{
				var index = vm.sourse.findIndex(e=>e.id==sourse.id);
				vm.sourse.splice(index, 1);
				vm.hintMessage = 'Успішно видалено!';
			},
			err=>console.log(err)
		)
	}


	vm.currentSaves = {};

	vm.editSaves = function(data){
		vm.currentSaves = angular.copy(data);
	}

	vm.saveSaves = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		if (vm.currentSaves.id) {
			$http.put('/update_saves', vm.currentSaves).then(
				res=>{
					var index = vm.saves.findIndex(e=>e.id==vm.currentSaves.id);
					vm.saves.splice(index, 1, vm.currentSaves);
					vm.currentSaves = {};
					vm.hintMessage = 'Успішно оновлено!';
				},
				err=>console.log(err)
			)
		}else {
			if (vm.currentSaves._name) {
				$http.post('/create_saves', vm.currentSaves).then(
					res=>{
						$http.get('/get_table?field=' + 'saves').then(
							res=>{
								vm.saves = res.data;
								vm.hintMessage = 'Успішно збережено!';
							},
							err=>console.log(err)
						)
						vm.currentSaves = {};
					},
					err=>console.log(err)
				)
			}else {
				vm.hintMessage = 'Потрібно заповнити поле!';
			}
		}
	}

	vm.deleteObj = {};
	vm.openFlug = false;
	vm.selectedList = [];
	vm.deleteSaves = function(saves){
		vm.deleteObj.delete_id = saves.id;
		$http.get('/get_sum?id=' + saves.id).then(
			res=> {
				vm.deleteObj._sum = res.data[0]._sum;
				if(vm.deleteObj._sum == 0){
					$http.put('/delete_saves', vm.deleteObj).then(
						res=>{
							var index = vm.saves.findIndex(e=>e.id==vm.deleteObj.delete_id);
							vm.saves.splice(index, 1);
							vm.deleteObj = {};
							vm.hintMessage = 'Успішно видалено!';
						},
						err=>console.log(err)
					)
				}else {
					vm.openFlug = true;
					vm.selectedList = [];
					for (var i = 0; i < vm.saves.length; i++) {
						if (vm.saves[i].id != vm.deleteObj.delete_id) {
							vm.selectedList.push(vm.saves[i]);
						}
					}
				}
			},
			err=>console.log(err)
		)

		
	}

	vm.cancalQuery = function(){
		vm.openFlug = false;
		vm.deleteObj = {};
	}

	vm.confirmQuery = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		$http.put('/delete_saves', vm.deleteObj).then(
			res=>{
				var index = vm.saves.findIndex(e=>e.id==vm.deleteObj.delete_id);
				vm.saves.splice(index, 1);
				vm.deleteObj = {};
				vm.hintMessage = 'Успішно видалено!';
			},
			err=>console.log(err)
		)
		vm.openFlug = false;
	}

	vm.currentCategory = {};
	vm.editCategory = function(data){
		vm.currentCategory = angular.copy(data);
	}

	vm.deleteCategory = function(category){
		$http.put('/delete_category', {id: category.id}).then(
			res=>{
				var index = vm.category.findIndex(e=>e.id==category.id);
				vm.category.splice(index, 1);
				vm.hintMessage = 'Успішно видалено!';
			},
			err=>console.log(err)
		)
	}

	vm.saveCategory = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		if (vm.currentCategory.id) {
			$http.put('/update_category', vm.currentCategory).then(
				res=>{
					var index = vm.category.findIndex(e=>e.id==vm.currentCategory.id);
					vm.category.splice(index, 1, vm.currentCategory);
					vm.currentCategory = {};
					vm.hintMessage = 'Успішно оновлено!';
				},
				err=>console.log(err)
			)
		}else {
			if (vm.currentCategory._name) {
				$http.post('/create_category', vm.currentCategory).then(
					res=>{
						$http.get('/get_table?field=' + 'category').then(
							res=>{
								vm.category = res.data;
								vm.hintMessage = 'Успішно збережено!';
							},
							err=>console.log(err)
						)
						vm.currentCategory = {};
					},
					err=>console.log(err)
				)
			}else {
				vm.hintMessage = 'Потрібно заповнити поле!';
			}
		}
	}
}]);