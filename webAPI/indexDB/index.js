// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// create instance for database object which is for store the database opened.
let db;
window.onload = function() {
    // open existing database, or create new database, if there is no existing database.
    let request = window.indexedDB.open("notes", 1);

    // when could not open database.
    request.onerror = function() {
        console.log("Database failed to open.");
    }

    // when could open database.
    request.onsuccess = function() {
        console.log("Database opened successfully.");

        // asign database object in to db.
        db = request.result;

        displayData();
    }

    // set the table of database, when it dosen't run.
    request.onupgradeneeded = funstion(e) {
        // request the reference for the opened database
        let db = e.target.result;
        // create object store 
        let objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement:true});
        // define the data items
        objectStore.createIndex("title", "title", {unique:false});
        objectStore.createIndex("body", "body", {unique:false});

        console.log("Database setup complete.");
    }

    // create onsubmit handler to run addData function when form is sended.
    form.onsubmit = addData;

    // define addData function.
    function addData(e) {
        // stop the default function.
        e.preventDefault();
        // check value in form feild. and store value in to the object.
        let newItem = {title: titleInput.value, body: bodyInput.value};
        // ready to insert data.
        let transaction = db.transaction(["notes"], "readwrite");
        // call object store.
        let objectStore =  transaction.objectStore("notes");
        // create the request for insert the new Item.
        let request =  objectStore.add(newItem);
        request.onsuccess = function() {
            //clear the form and ready to next entry.
            titleInput.value = "";
            bodyInput.value = "";
            // all is done, report the success of the transaction.
            transaction.complete = function() {
                console.log("Transaction completed: Database modification finished.");
                //run displayData function again.
                displayData();
            }
            transaction.onerror = function() {
                console.log("Transaction not opened due to error.");
            }
        }
    }
}