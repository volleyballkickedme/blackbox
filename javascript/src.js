//import statements
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'
import {getDatabase, ref, remove, set, push, onValue, orderByChild} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js'

//firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyAAIiFtLboNZ_CsEKvJlG8J-0JhEZixDh0",
  authDomain: "blackbox-091283.firebaseapp.com",
  databaseURL: "https://blackbox-091283-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blackbox-091283",
  storageBucket: "blackbox-091283.appspot.com",
  messagingSenderId: "571688596669",
  appId: "1:571688596669:web:cced0bf249ba230b72b3d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//define variables
const welcomeMessage = document.getElementById('welcome-el')
const inputField = document.getElementById('input-el')
const locationDisplay = document.getElementById('storage-el')
const inputTypeSelector = document.getElementById('type-el')


const outputDisplay = document.getElementById('output-display')
const outputTypeSelector = document.getElementById('generate-selector')

//buttons
const submitButton = document.getElementById('enter-btn')
const generateButton = document.getElementById('generate-btn')

//initialize database
const database = getDatabase(app)
const activityList = ref(database, "Activities")
const breakfastList = ref(database, "Breakfast")
const lunchList = ref(database, "Lunch")
const dinnerList = ref(database, "Dinner")

//dictionary dupe
const types = {
  "breakfast" : breakfastList,
  "lunch" : lunchList, 
  "dinner" : dinnerList,
  "activity" : activityList
}

//function that returns the database pointer based on the input field value
const typeArray = Object.entries(types)
function databasePointer(input) {
  for(let i = 0; i < typeArray.length; i++) {
    if(input == typeArray[i][0]) {
      return typeArray[i][1]
    }
  }
  return database;
}


//decide the node that the data should be stored under

//initialize the display
displayRefresh()

//Functionality for submit button
submitButton.addEventListener('click', function() {
    const userInput = inputField.value
    const type = inputTypeSelector.value
    if(userInput != '' && type != "") {
      //select relevant node to push data to
      //add to database
      //push item to database, push creates a new node under the specified parent with a unique key and returns a reference to the latest item added
      const newItemRef = push(databasePointer(type), userInput)
      //set sets the value of the newly created child, as push only creates the key
      set(newItemRef, userInput)
        
      //refresh the display with latest elements from database
      displayRefresh()

      //clear input field
      inputField.value = ''
      inputTypeSelector.selectedIndex = 0

    }
})

//function to refresh the display list
function displayRefresh() {
  // Clear the current display
  locationDisplay.innerHTML = "";

  // Define an array of lists and their corresponding Firebase references
  const lists = [
    { name: "Activities", ref: activityList },
    { name: "Breakfast", ref: breakfastList },
    { name: "Lunch", ref: lunchList },
    { name: "Dinner", ref: dinnerList }
  ];

  // Iterate through each list
  lists.forEach(list => {
    // Fetch items from the database
    onValue(list.ref, function(snapshot) {
      if(snapshot.exists()) {
        // Convert snapshot to an array of key-value pairs
        const dataArray = Object.entries(snapshot.val());
        
        // Iterate through the array and append each item onto the display
        dataArray.forEach(([key, value]) => {
          const location = document.createElement('li');
          location.setAttribute('id', key); // Set ID of the li item
          location.textContent = value;
          locationDisplay.appendChild(location)

          //add functionality to remove
          location.addEventListener('dblclick', function() {
            let removePointer = ref(database, `${list.name}/${key}`)
            remove(removePointer)
            displayRefresh()
          })
          locationDisplay.append(location);
        });
      }
    });
  });
}


//generate button functionality
generateButton.addEventListener('click', function() {
  const outputType = outputTypeSelector.value

  //fetch current database
  onValue(databasePointer(outputType), function(snapshot) {
    if(snapshot.exists()) {
      outputDisplay.textContent = ""
      //retrieve value set and convert to array
      let outputArray = Object.values(snapshot.val())
      const output = randomGenerator(outputArray)
      outputDisplay.textContent = output 
      outputTypeSelector.selectedIndex = 0
    }
    else {
      outputDisplay.textContent = ""
    }
  })
})

//clear the output display
outputDisplay.addEventListener('click', function() {
  outputDisplay.textContent = ''
})

//function to generate a random location from a given array
function randomGenerator(array) {
  //array consists of all the Activities stored in the database
  //generate a random index within range of the array size
  const index = randomNumberGenerator(0, array.length)
  //output element is the element at the generated index, return output element
  return array[index]
}

//random number generator
function randomNumberGenerator(min, max) {
  min = Math.ceil(min); // Round up to the nearest integer
  max = Math.floor(max); // Round down to the nearest integer
  return Math.floor(Math.random() * (max - min)) + min;
}
