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
    request.onupgradeneeded = function(e) {
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

    // define displayData() function
    function displayData() {
        // remove list element when display is refreshed.
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        // open objectStore and get cursor.
        let objectStore = db.transaction("notes").objectStore("notes");
        objectStore.openCursor().onsuccess = function(e) {
            // request reference of cursor.
            let cursor = e.target.result;

            if (cursor) {
                // create content h3 and p
                const listItem = document.createElement("li");
                const h3 = document.createElement("h3");
                const para = document.createElement("p");

                listItem.appendChild(h3);
                listItem.appendChild(para);
                list.appendChild(listItem);

                // asign data from corsor into h3 and p.
                h3.textContent = cursor.value.title;
                para.textContent = cursor.value.body;
                
                // save ID into listItem.
                listItem.setAttribute("data-note-id", cursor.value.id);

                // create button ans set into listItem.
                const deleteBtn = document.createElement("button");
                listItem.appendChild(deleteBtn);
                deleteBtn.textContent = "delete";

                // run deleteItem() function when button is pressed.
                deleteBtn.onclick = deleteItem;

                // continue task of cursor
                cursor.continue();
            } else {
                if (!list.firstChild) {
                    const listItem = document.createElement("li");
                    listItem.textContent = "no notes stored";
                    list.appendChild(listItem);
                }
                console.log("Notes all displayed");
            }
        }
    }

    // define deleteItem() function
    function deleteItem(e) {
        // get ID which is you want to delete.
        // change number type.
        let noteID = Number(e.target.parentNode.getAttribute("data-note-id"));

        // open data transaction and delete ID.
        let transaction = db.transaction(["notes"], "readwrite");
        let objectStore = transaction.objectStore("notes");
        let request = objectStore.delete(noteID);

        // report that to delete data was completed.
        transaction.oncomplete = function() {
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            console.log("Note " + noteID + " deleted.");

            if (!list.firstChild) {
                let listItem = document.createElement("li");
                listItem.textContent = "No notes stored.";
                list.appendChild("listItem");
            }
        }
    }
}