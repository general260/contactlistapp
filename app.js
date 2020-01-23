//Book Class: Represents a book to be instantiated
class Contact {
    constructor(name, number, location) {
        this.name = name;
        this.number = number;
        this.location = location;
    }
}

//UI Class: Handles the UI tasks
class UI {
    static displayContacts() {
        //The local storage 
        const contacts = Store.getContacts();

        //Loop through the contacts and adds the book using the method
        contacts.forEach((contact) => UI.addContactsToList(contact));
    }

    static addContactsToList(contact) {
        const list = document.querySelector('#contact-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.number}</td>
            <td>${contact.location}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteContact(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#contact-form');
        container.insertBefore(div, form);

        //vanish in 2 secs
        setTimeout(() => document.querySelector('.alert'). remove(), 2000);
    }

    static clearField() {
        document.querySelector('#name').value = '';
        document.querySelector('#number').value = '';
        document.querySelector('#location').value = '';
    }
}


//Store Class: Handles Storage locally 
class Store {
    static getContacts() {
        let contacts;
        if(localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }

        return contacts;
    }

    static addContacts(contact) {
        const contacts = Store.getContacts();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(number) {
        const contacts = Store.getContacts();
       
        contacts.forEach((contact, index) => {
            if(contact.number === number) {
                contact.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

//Event: Display Contact 
document.addEventListener('DOMContentLoaded', UI.displayContacts);

//Event: Add a Contact
document.querySelector('#contact-form').addEventListener('submit', (e) => {

    //prevent the default action on submit button
    e.preventDefault();
    //Get form values
    const name = document.querySelector('#name').value;
    const number = document.querySelector('#number').value;
    const location = document.querySelector('#location').value;

    //validate the fields
    if(name === '' || number === '' || location === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
            
        //instantiate a contact
        const contact = new Contact(name, number, location);

        //Add book to list
        UI.addContactsToList(contact);

        //Add book to storage
        Store.addContacts(contact);

        //show success message
        UI.showAlert('Contact Added', 'success')

        //To clear fields after input
        UI.clearField();
    }

});

//Event: Remove a Contact
document.querySelector('#contact-list').addEventListener('click', (e) => {
    
    //Remove contact from UI
    UI.deleteContact(e.target);

    //Remove contact from storage
    Store.removeContact(e.target.parentElement.previousElementSibling.textContent);


    //show success message
    UI.showAlert('Contact Deleted', 'success')
});
