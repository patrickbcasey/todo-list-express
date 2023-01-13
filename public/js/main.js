const deleteBtn = document.querySelectorAll('.fa-trash'); //selects all delete buttons and assigns them to a variable called deleteBtn
const item = document.querySelectorAll('.item span'); //selects all list items and assigns them to a variable called item
const itemCompleted = document.querySelectorAll('.item span.completed'); //selects all completed todos and assigns them to a variable called itemCompleted

Array.from(deleteBtn).forEach((element) => { //creates array of delete buttons
    element.addEventListener('click', deleteItem); //adds event listeners to each delete button
});

Array.from(item).forEach((element) => { //creates an array of todos
    element.addEventListener('click', markComplete); //adds event listeners to each todo
});

Array.from(itemCompleted).forEach((element) => { //creates an array of completed todos
    element.addEventListener('click', markUnComplete); //adds event listener to each completed todo
});

async function deleteItem(){ //creates an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText; //assigns the current node's inner text to a variable called itemText
    try{ //error handling
        const response = await fetch('deleteItem', { //makes a fetch request on the /deleteItem route
            method: 'delete', //makes the request type DELETE
            headers: { 'Content-Type': 'application/json' }, //sends the header saying that the put data is in json format
            body: JSON.stringify({ //makes the request.body into json
                'itemFromJS': itemText //puts item into the request.body
            })
        });
        const data = await response.json();
        console.log(data); // logs the data
        location.reload(); //refreshes the page

    }catch(err){ //error handling
        console.log(err); //logs the error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText;
    try{ //error handling
        const response = await fetch('markComplete', { //makes a fetch request on the /markComplete route
            method: 'put', //makes the request type PUT
            headers: { 'Content-Type': 'application/json' }, //sends the header saying that the put data is in json format
            body: JSON.stringify({ //makes the request.body into json
                'itemFromJS': itemText //puts item into the request.body
            })
        });
        const data = await response.json();
        console.log(data); // logs the data
        location.reload(); //refreshes the page

    }catch(err){ //error handling
        console.log(err); //logs the error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText;
    try{ //error handling
        const response = await fetch('markUnComplete', { //makes a fetch put request on the /markUnComplete route
            method: 'put', //makes the request type PUT
            headers: { 'Content-Type': 'application/json' }, //sends the header saying that the put data is in json format
            body: JSON.stringify({ //makes the request.body into json
                'itemFromJS': itemText //puts item into the request.body
            })
        });
        const data = await response.json(); //parses response as json
        console.log(data); // logs the data
        location.reload(); //refreshes the page

    }catch(err){ //error handling
        console.log(err); //logs the error
    }
}