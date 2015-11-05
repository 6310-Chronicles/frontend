var currModel = model; 
var priority=0;
var viewModel = {
	self: this, 
	list1: ko.observableArray([]),
	list2: ko.observableArray([]),
	studentNm: "",
	studentId: "", 
	
	init: function () {
			;
			// todo 
	},
		
	dispHistDemand: function (value) {
		//console.log("value is "+value.desc);
	},

	hideHistDemand: function (value) {
		//console.log("value is "+value.desc);
	},	

	prefCourse: function (priority,id,desc) {
			this.priority=priority; 
			this.id=id;
			this.desc=desc;
	},
	
	addCourse: function (value) {

		var notYetListed=true; 
		var addPriority=0
		
		for (var i=0;i < viewModel.list2().length; i++) {
			if (viewModel.list2()[i].id == value.id ) {
				notYetListed=false; 
				break;
			}
		};
		if (notYetListed) {
			priority=priority+1;
			viewModel.list2.push(new viewModel.prefCourse(priority,value.id,value.desc));
		}
	},
	
	incPriority: function (value) {
	
		var index = viewModel.list2.indexOf(value); 
		if (index > 0) { 
			viewModel.list2.splice(index,1); 
			viewModel.list2.splice(index-1,0,new viewModel.prefCourse(value.priority,value.id,value.desc));
			viewModel.updatePriorities();
		}
	},
	
	decPriority: function (value) {
	
		var index = viewModel.list2.indexOf(value); 
		if (index >=0 && index < viewModel.list2().length -1 ) {	
			viewModel.list2.splice(index,1); 
			viewModel.list2.splice(index+1,0,new viewModel.prefCourse(value.priority,value.id,value.desc));
			viewModel.updatePriorities();
		}
	},
		
	
	delCourse: function (value) {

		var index = viewModel.list2.indexOf(value); 
		if (index >=0)	viewModel.list2.splice(index,1);

		priority=priority-1;
		
		viewModel.updatePriorities();
	},
	
	updatePriorities: function () {
		//console.log("updating priorities");
		var tempList=[];

		for (var i=0;i < viewModel.list2().length; i++) {
			tempList.push(new viewModel.prefCourse(i+1,viewModel.list2()[i].id,viewModel.list2()[i].desc));
		}
		
		viewModel.list2.removeAll(); 
		
		for (var i=0;i < tempList.length; i++) {
 		//console.log("array length is "+templist.length+" i is "+i); 
			viewModel.list2.push(tempList[i]); 
		}

	},

	
	initStudent: function(student) {
		viewModel.studentNm=student.firstName+" "+student.lastName;
		viewModel.studentId=student.id;
	},
	
	initCourseList: function () {
		courses = currModel.Courses;
		for (var course in courses) {
			viewModel.list1.push(courses[course]);
			//console.log(courses[course].desc+" added to courselist");
		};
	}
	};
	//viewModel.initCourseList();
	

viewModel.initStudent(currModel.getStudent());	
viewModel.initCourseList(); 
ko.applyBindings(viewModel);

window.addEventListener('load',viewModel.init() ); 


 


		