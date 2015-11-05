var model = {
  
currStudent : { "lastName":"Pelton", "firstName":"Scott", "id":99999}, 


Courses : [ {id:"CS6210","desc":"Advanced Operating Systems","demand":139},
{id:"CSE6220",desc:"Intro to High-Performance Computing","demand":188},
{id:"CS6250","desc":"Computer Networks","demand":199},
{id:"CS6300","desc":"Software Design","demand":185},
{id:"CS6310","desc":"Software Architecture and Design","demand":140},
{id:"CS6505","desc":"Computability, Complexity and Algorithms","demand":122},
{id:"CS7641","desc":"Machine Learning","demand":200},
{id:"CS7646","desc":"Machine Learning for Trading","demand":101}
],

getCourseList: function () {

return model.Courses;
},

getStudent: function () {
console.log("returning "+model.currStudent.lastName+model.currStudent.firstName+model.currStudent.id); 
return model.currStudent;
}
}