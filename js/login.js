// handler for submit event from login page
$( "#submitForm" ).submit(function( event ) {
	var user = $("#userid").val();
	var pass = $("#password").val();
	if(user == "admin" && pass == "password"){
		var url = "adminPortal.html";    
		$(location).attr('href',url);
		return false;
	}else{
		if (userModel.confirmUser(user,pass)) {
			if (typeof(Storage) !== "undefined") {
				localStorage.clear(); 
				localStorage.setItem("login", user);   // use browser local storage to pass login. 
			} else {
				console.log('no localstorage support');
			};
				var url = "student.html";    
				$(location).attr('href',url);
				return false;
		} else
			alert("Invalid Username or Password");
	}
	//return false;
});

// simulation of list of registered users
var userModel = {
registeredUsers : [{"login":"student1","password":"password1"},
					{"login":"student2","password":"password2"},
					{"login":"student8","password":"password8"}],
			
confirmUser: function (user,password) {
	var confirmed=false; 
	var users = userModel.registeredUsers;
	var length = users.length;
	for (var i=0 ;i<length;i++) {
		if (users[i].login==user && users[i].password==password) {
			confirmed=true;
		}
		if (confirmed) break;
			};
	return confirmed;

	}
};
		