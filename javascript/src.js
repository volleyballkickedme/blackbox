//import statements
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'
import {getDatabase, ref, remove, set, push} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js'

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

//Functionality for submit button
submitButton.addEventListener('click', function() {
    const userInput = inputField.value
    if(userInput != '') {
        //add to database
        //push item to database, push creates a new node under the specified parent with a unique key and returns a reference to the latest item added
        const newItemRef = push(locationList)
        //set sets the value of the newly created child, as push only creates the key
        set(newItemRef, userInput)
        //add to display
        const location = document.createElement('li')
        location.setAttribute('id', 'location-el')
        location.textContent = userInput
        locationDisplay.append(location)
        //clear input field
        inputField.value = ''
    }
})

//Remove element from display/database
// Function to handle double-click event
function handleDoubleClick(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    // Remove the clicked <li> element
    target.remove();
    //remove from database
    
  }
}
// Add event listener to <ul> to handle double-click on <li> items
locationDisplay.addEventListener('dblclick', handleDoubleClick);
