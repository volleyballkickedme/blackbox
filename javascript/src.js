//import statements
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'
import {getDatabase, ref, remove, set, push, onValue} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js'

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
let welcomeMessage = document.getElementById('welcome-el')
let inputField = document.getElementById('input-el')
let locationDisplay = document.getElementById('storage-el')
let outputDisplay = document.getElementById('output-display')

//buttons
const submitButton = document.getElementById('enter-btn')
const generateButton = document.getElementById('generate-btn')
const locationElement = document.getElementById('location-el')

//initialize database and a list of locations
const database = getDatabase(app)
const locationList = ref(database, "Locations")

//initialize the display
displayRefresh()

//Functionality for submit button
submitButton.addEventListener('click', function() {
    const userInput = inputField.value
    if(userInput != '') {
        //add to database
        //push item to database, push creates a new node under the specified parent with a unique key and returns a reference to the latest item added
        const newItemRef = push(locationList)
        //set sets the value of the newly created child, as push only creates the key
        set(newItemRef, userInput)
        
        //refresh the display with latest elements from database
        displayRefresh()

        //clear input field
        inputField.value = ''
    }
})

//Remove element from display/database
// Function to handle double-click event
function handleDoubleClick(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    //remove from database
    //obtain reference of object to be removed
    let deletePointer = ref(database, `Locations/${target.id}`)
    remove(deletePointer)
    //update display
    displayRefresh()
  }
}
// Add event listener to <ul> to handle double-click on <li> items
locationDisplay.addEventListener('dblclick', handleDoubleClick);

//function to refresh the display list
function displayRefresh() {
  //fetch items from database and store them in an array
  onValue(locationList, function(snapshot) {
    if(snapshot.exists()) {
      let locationsArray = Object.entries(snapshot.val())
      //clear the current display
      locationDisplay.innerHTML = ""
      //iterate through the list and append each item onto the display
      for(let i = 0; i < locationsArray.length; i++) {
        //add to display
        const location = document.createElement('li')
        //set ID of the li item to be the same as the ID in firebase for ease of access
        location.setAttribute('id', locationsArray[i][0])
        location.textContent = locationsArray[i][1]
        //add the new entry to the list
        locationDisplay.append(location)
      }
    }
    else {
      locationDisplay.innerHTML = "Start adding locations..."
    }
  })
}


//generate button functionality
generateButton.addEventListener('click', function() {
  //fetch current database
  onValue(locationList, function(snapshot) {
    if(snapshot.exists()) {
      outputDisplay.textContent = "Location: "
      //retrieve value set and convert to array
      let outputArray = Object.values(snapshot.val())
      const output = randomGenerator(outputArray)
      outputDisplay.textContent += output 
    }
    else {
      outputDisplay.textContent = "Location: "
    }
  })
})
//function to generate a random location from a given array
function randomGenerator(array) {
  //array consists of all the locations stored in the database
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
