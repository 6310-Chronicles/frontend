
var viewModel = {
	list1: ko.observableArray([]),
	list2: ko.observableArray([]),
	list3: ko.observableArray([]),
	showMsg:ko.observable(false),
	errMsg:ko.observable(false),
	infoMsg:ko.observable(false),
	submitted: ko.observable(false),
	noReset:ko.observable(true),
	listEmpty: ko.observable(true),
	message:ko.observable(),
	studentNm: "",
	studentId: "", 
	
	init: function () {
	
	api.sendRequest(1);
			;
			// todo 
	},
		
	dispHistDemand: function (value) {
		//TO DO console.log("value is "+value.desc);
	},

	hideHistDemand: function (value) {
		//TO DO console.log("value is "+value.desc);
	},	

	prefCourse: function (priority,id,desc) {
			this.priority=priority; 
			this.id=id;
			this.desc=desc;
	},
	
	addCourse: function (value) {
		console.log('value is: '+JSON.stringify(value)); 
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
			viewModel.resetAlert();
		} else {
		viewModel.setAlert('error','You have already selected this course. Choose another one.')
		}
		if (viewModel.listEmpty()) { viewModel.listEmpty(false); viewModel.noReset(false);} 
	},
	
	incPriority: function (value) {
		if  (viewModel.submitted()) return false; 
		var index = viewModel.list2.indexOf(value); 
		if (index > 0) { 
			viewModel.list2.splice(index,1); 
			viewModel.list2.splice(index-1,0,new viewModel.prefCourse(value.priority,value.id,value.desc));
			viewModel.updatePriorities();
		}
	},
	
	decPriority: function (value) {
		if (viewModel.submitted()) return false; 
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
		if (viewModel.list2().length>0)
		viewModel.updatePriorities();
		else {
			viewModel.listEmpty(true);
			viewModel.noReset(true);
		}
	},
	
	
	setRecCourseList: function (value) {
		viewModel.list3.removeAll();
		value.forEach(function(item) {
			viewModel.list3.push(item);
		}); 
	},
	
	updatePriorities: function () {
		var tempList=[];

		for (var i=0;i < viewModel.list2().length; i++) {
			tempList.push(new viewModel.prefCourse(i+1,viewModel.list2()[i].id,viewModel.list2()[i].desc));
		}
		
		viewModel.list2.removeAll(); 
		
		for (var i=0;i < tempList.length; i++) {
			viewModel.list2.push(tempList[i]); 
		}

	},

	
	initStudent: function(student) {
		viewModel.studentNm=student.firstName+" "+student.lastName;
		viewModel.studentId=student.id;
	},
	
	initCourseList: function (courses) {
		for (var course in courses) {
			viewModel.list1.push(courses[course]);
		};
	},
	initLists: function()
	{
		viewModel.list2.removeAll();
		viewModel.list3.removeAll();
		viewModel.listEmpty(true); 
	},
	
		
	submitQuery: function () {
		var uuid='1';
		api.sendRequest(3,uuid);
		viewModel.resetView(); 

		
	},
	
	submitPreferrences: function () {
		var list2Length = viewModel.list2().length;
		var courses=[];
		var data={};
		var id='123456789';
		if (list2Length > 0 ) {
			for (var i=0; i< list2Length; i++) {
				console.log(JSON.stringify(viewModel.list2()[i]));
				courses.push(viewModel.list2()[i].id);
			}
			data.studentId=id;
			data.courses=courses;
			api.sendRequest0(2,data);
			viewModel.setAlert('info','Your preferences have been sent. Results will be posted soon.');
			viewModel.submitted(true);
			viewModel.listEmpty(true);

		} else {
			viewModel.setAlert('error','You have not selected any course. You must select at least one.');
		}
		},
	setAlert: function(type,msg) {
		viewModel.errMsg(false);
		viewModel.infoMsg(false);

		if (type == 'error') 
			viewModel.errMsg(true);
		else
			viewModel.infoMsg(true);
		viewModel.showMsg(true)
		viewModel.message(msg);
	},
	
	resetAlert: function () {
		viewModel.showMsg(false);
		viewModel.errMsg(false);
		viewModel.infoMsg(false);	
		},
	
	resetView: function() {
		viewModel.submitted(false);
		viewModel.noReset(true);
		viewModel.initLists();
		viewModel.resetAlert();
		priority=0;
		}
	
	};
	
	
var api = {

 baseURL : 'http://cs6310-api-v1.mybluemix.net/api',
 sendRequest: function(type,data){
		var s_cb,s_url,s_data={},s_method='GET';
		switch (type) {
			case 1:
				s_cb=api.success1;
				s_url='/course/allCourses';
				break;
			case 2:
				s_cb=api.success2;
				s_url='/student/studentsData';
				s_method='POST';
				s_data.studentData=data;
				break;
			case 3:
				s_cb=api.success3;
				s_url='/student/allStudents';
				s_data.studentId=data;
				break;
			default:
				s_cb=api.success2;
				s_url='/course/allCourses';
				break;
			}
		//if (data) s_data.studentData=data;
 		$.ajax({
			url : api.baseURL+s_url,
			beforeSend: api.beforeSend,
			success: s_cb,
			data: s_data,
			method: s_method,
			//dataType: 'jsonp',
			error: api.error,
			complete: api.complete
			
		});
		
		console.log('data '+s_data); 
		
		
 }, 
  sendRequest0: function(type,data){
		var s_cb,s_url,s_data={}; 
//		console.log('sendRequest data stringified is '+JSON.stringify(data)); 
		switch (type) {
			case 1:
				s_cb=api.success1;
				s_url='/course/allCourses';
				break;
			case 2:
				s_cb=api.success2;
				s_url='/student/studentsData';
				s_type='POST';
				s_data.studentsData=JSON.stringify(data);
				break;
			case 3:
				s_cb=api.success3;
				s_url='/student/allStudents';
				
				break;
			default:
				s_cb=api.success2;
				s_url='/course/allCourses';
				break;
			}
 		$.ajax({
			url : api.baseURL+s_url,
			type: 'POST',
			dataType: 'json',
			data: s_data,
			success: s_cb,
			error: api.error,
			complete: api.complete
			
		});
		//console.log('data '+JSON.stringify(s_data)); 

   },
 success1: function (data, textStats, XMLHttpResponse) {
			console.log('SUCCESS1:'); 
			if (data.status == "OK") {
				var listOfCourses=[];
				var noOfCourses = data.response.length;
				for (i=0; i<noOfCourses; i++){
					listOfCourses[i]={"id":data.response[i].courseId,"desc":data.response[i].courseName,"demand":data.response[i].currentEnrollment};
				}
			}
			viewModel.initCourseList(listOfCourses); 
			},
 success2: function (data, textStats, XMLHttpResponse) {
			console.log('SUCCESS2:'); 
//			console.log('data: '+JSON.stringify(data)); console.log('textStats: '+JSON.stringify(textStats)); 	console.log('XMLHttpResponse: '+JSON.stringify(XMLHttpResponse));
			if (textStats == "success") {
				var listOfCourses1=[];
				var listOfCourses2=viewModel.list1();
				var noOfCourses = data.courses.length;
				for (i=0; i<noOfCourses; i++){
					var courseName;
					listOfCourses2.forEach(function(course) {
						if (course.id == data.courses[i]) {courseName=course.desc; ++course.demand; return;}
					}); 
					listOfCourses1[i]={"id":data.courses[i],"desc":courseName};
					console.log('added '+listOfCourses1[i]);
				}
			viewModel.setRecCourseList(listOfCourses1);
			viewModel.setAlert('info','PROCESSING COMPLETE. See list of recommended courses');
			}

			},
 success3: function (data, textStats, XMLHttpResponse) {
			console.log('SUCCESS3:'); 
			
			if (data.status == "OK") {
				var listOfCourses=[];
				var noOfCourses = data.response.length;
				for (i=0; i<noOfCourses; i++){
					listOfCourses[i]={"id":data.response[i].courseId,"desc":data.response[i].courseName,"demand":data.response[i].currentEnrollment};
				}
			}
			},

beforeSend: function (data, textStats, XMLHttpResponse) {
 						console.log(' '); console.log('BEFORESEND:');
			},			
complete: function (data, textStats, XMLHttpResponse) {
 						console.log(' '); console.log('COMPLETE:');
			},
error: function (data, textStats, XMLHttpResponse) {
 						console.log(' '); console.log('ERROR:');
				console.log('data: '+JSON.stringify(data)); console.log('textStats: '+JSON.stringify(textStats)); 	console.log('XMLHttpResponse: '+JSON.stringify(XMLHttpResponse));
			}	
 }

 var model = {
  
currStudent : { "lastName":"Burdell", "firstName":"George P", "id":123456789}, 


getStudent: function () {
	console.log("returning "+model.currStudent.lastName+model.currStudent.firstName+model.currStudent.id); 
	return model.currStudent;
}
}
var currModel = model; 
var priority=0;

viewModel.initStudent(currModel.getStudent());	
//viewModel.initCourseList(); 
ko.applyBindings(viewModel);

window.addEventListener('load',viewModel.init() ); 

		