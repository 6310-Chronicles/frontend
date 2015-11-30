
// The viewModel object contains all the objects with bindings in the presentation layer
// as well as the javascript functions that control those objects
var viewModel = {
	list1: ko.observableArray([]),  // list of available courses
	list2: ko.observableArray([]),	// list of preferred courses
	list3: ko.observableArray([]),	// list of recommended courses

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
		api.sendRequest(1); // sends AJAX request to retrieve Availabel courses
			;
	},

	// add course to preferred list
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
			viewModel.list2.push(new model.prefCourse(priority,value.id,value.desc));
			viewModel.resetAlert();
		} else {
		viewModel.setAlert('error','You have already selected this course. Choose another one.')
		}
		if (viewModel.listEmpty()) { viewModel.listEmpty(false); viewModel.noReset(false);} 
	},
	
	// increase priority of course cin preferred list 
	incPriority: function (value) {
		if  (viewModel.submitted()) return false; 
		var index = viewModel.list2.indexOf(value); 
		if (index > 0) { 
			viewModel.list2.splice(index,1); 
			viewModel.list2.splice(index-1,0,new model.prefCourse(value.priority,value.id,value.desc));
			viewModel.updatePriorities();
		}
	},
	
	// decrease priority of course in preferred list 
	decPriority: function (value) {
		if (viewModel.submitted()) return false; 
		var index = viewModel.list2.indexOf(value); 
		if (index >=0 && index < viewModel.list2().length -1 ) {	
			viewModel.list2.splice(index,1); 
			viewModel.list2.splice(index+1,0,new model.prefCourse(value.priority,value.id,value.desc));
			viewModel.updatePriorities();
		}
	},
	
	// reassign priorities
	updatePriorities: function () {
		var tempList=[];
		for (var i=0;i < viewModel.list2().length; i++) {
			tempList.push(new model.prefCourse(i+1,viewModel.list2()[i].id,viewModel.list2()[i].desc));
		}
		viewModel.list2.removeAll(); 
		for (var i=0;i < tempList.length; i++) {
			viewModel.list2.push(tempList[i]); 
		}
	},	
	// remove course from preferred list 
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
	// display recommended course list
	setRecCourseList: function (value) {
		viewModel.list3.removeAll();
		value.forEach(function(item) {
			viewModel.list3.push(item);
		}); 
	},
	// initialize student info 
	initStudent: function(student) {
		viewModel.studentNm=student.firstName+" "+student.lastName;
		viewModel.studentId=student.id;
	},
	// initialize available course list 
	initCourseList: function (courses) {
		for (var course in courses) {
			viewModel.list1.push(courses[course]);
		};
	},
	
	// initialize preferred and recommended lists
	initLists: function()
	{
		viewModel.list2.removeAll();
		viewModel.list3.removeAll();
		viewModel.listEmpty(true); 
	},
	
	// query student info
	submitQuery: function () {
		var id=model.getCurrStudentId();
		api.sendRequest(3,id);
		viewModel.resetView(); 
		
	},
	
	// submit student preferences
	submitPreferrences: function () {
		var list2Length = viewModel.list2().length;
		var courses=[];
		var data={};
		var id=model.getCurrStudentId();
		if (list2Length > 0 ) {
			for (var i=0; i< list2Length; i++) {
				console.log(JSON.stringify(viewModel.list2()[i]));
				courses.push(viewModel.list2()[i].id);
			}
			data.studentId=id;
			data.courses=courses;
			api.sendRequest(2,data);
			viewModel.setAlert('info','Your preferences have been sent. Recommended Courses will be posted when processing is completed.');
			viewModel.submitted(true);
			viewModel.listEmpty(true);

		} else {
			viewModel.setAlert('error','You have not selected any course. You must select at least one.');
		}
		},
	
	// display alert message 	
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
	// remove alert message 	
	resetAlert: function () {
		viewModel.showMsg(false);
		viewModel.errMsg(false);
		viewModel.infoMsg(false);	
		},
	
	// reset the view
	resetView: function() {
		viewModel.submitted(false);
		viewModel.noReset(true);
		viewModel.initLists();
		viewModel.resetAlert();
		priority=0;
		},
	// get user login from localStorage	
	getLogin: function() {
		var userLogin=localStorage.getItem("login");
		return userLogin; 
	}
	
};
	
// the API object contains the function that makes AJAX calls with the backend
// as well as the callback functions to parse the data returned. 	
var api = {

	baseURL : 'http://cs6310-api-v1.mybluemix.net/api',
	sendRequest: function(type,data){
		var s_cb,s_url,s_data={},s_method='GET';
		switch (type) {
			case 1:  // retrieve all available courses
				s_cb=api.success1;
				s_url='/course/allCourses';
				break;
			case 2:  // send student course preferences
				s_cb=api.success2;
				s_url='/student/studentsData';
				s_method='POST';
				s_data.studentData=JSON.stringify(data);
				break;
			case 3: // retrieve student info
				s_cb=api.success3;
				s_url='/student/allStudents';
				s_data.studentId=data;
				break;
			default:
				s_cb=api.success2;
				s_url='/course/allCourses';
				break;
			}
 		$.ajax({
			url : api.baseURL+s_url,
			success: s_cb,
			data: s_data,
			dataType: 'json',
			method: s_method,
			error: api.error			
		});
	}, 
	// callback functions
	success1: function (data, textStats, XMLHttpResponse) {
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
				}
				viewModel.setRecCourseList(listOfCourses1);
				viewModel.setAlert('info','PROCESSING COMPLETE. See list of recommended courses');
			}

		},
	success3: function (data, textStats, XMLHttpResponse) {
			console.log('SUCCESS3:'); 

		},
	error: function (data, textStats, XMLHttpResponse) {
		console.log(' '); console.log('ERROR:');
		console.log('data: '+JSON.stringify(data)); console.log('textStats: '+JSON.stringify(textStats)); 	
		console.log('XMLHttpResponse: '+JSON.stringify(XMLHttpResponse));
		}			
 }

 var model = {
 
 	prefCourse: function (priority,id,desc) {
			this.priority=priority; 
			this.id=id;
			this.desc=desc;
	},
	
	currStudent:{},
	// local list of students
	students : [{ "lastName":"Burdell", "firstName":"George P.", "id":1}, 
				{ "lastName":"Burdellini", "firstName":"Giorgio Pizzicato", "id":2},
				{ "lastName":"Burdelino", "firstName":"Jorge Pacifico", "id":8}],
				
			
	getStudent: function (login) {

		switch (login) {
			case ("student1"):
				model.currStudent=model.students[0];
				break; 
			case ("student2"):
				model.currStudent=model.students[1];
				break;
			case ("student8"):
				model.currStudent=model.students[2];
				break;
			case (undefined):
				;;
				break;
		}
		return model.currStudent;
	},
	
	getCurrStudentId: function () {
		return model.currStudent.id;
	},
	
	
}

var priority=0;

viewModel.initStudent(model.getStudent(viewModel.getLogin()));	
ko.applyBindings(viewModel);
window.addEventListener('load',viewModel.init() ); 

		