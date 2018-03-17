
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDCvqR9FcBRvYaHjpsfHgyQkEHC_SZhjhM",
  authDomain: "train-scheduler-fa039.firebaseapp.com",
  databaseURL: "https://train-scheduler-fa039.firebaseio.com",
  projectId: "train-scheduler-fa039",
  storageBucket: "train-scheduler-fa039.appspot.com",
  messagingSenderId: "348552582198"
};
firebase.initializeApp(config);

var database = firebase.database();

//Problem 1: Get data from form
$("#add-train").on("click", function (event) {
  event.preventDefault();

  var name = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var first = moment($("#first-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

//Problem 2: Store that date in firebase
  var newTrain = {
    name: name,
    destination: destination,
    first: first,
    frequency: frequency
  }; //newTrain close

  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");

});//submit button closer

  //Problem 3: Convert that date so that it outputs on the train schedule
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
  
    //Things that need to be converted:
      //train name to train name
      //destination to destination
      //frequency to frequency
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var first = childSnapshot.val().first;
  var frequency = childSnapshot.val().frequency;
  
  console.log(name);
  console.log(destination);
  console.log(first);
  console.log(frequency);

     //convert first train time to next arrival 
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  console.log(remainder);
      //convert next arrival to minutes away by comparing with the current time
  // Minute Until Train
  var minutesTillTrain = frequency - remainder;
  console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

  // Next Train
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
    // Add each train's data into the table
  $("#train-table").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minutesTillTrain + "</td></tr>");
});
  
  
     