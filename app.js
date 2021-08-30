// Book Class: Represent a Book

class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks (Alert,show Book etc.)

class UI {
    static displayBooks() {
        //Hardcodet Array werden gelöscht sobald localStorage ins Spiel kommt
        //const StoredBooks = [
        //    {
        //        title: 'Book One',
        //        author: 'Rafael P',
        //        isbn: '250780'
        //    },
        //    {
        //        title: 'Book Two',
        //        author: 'Leni A',
        //        isbn: '040211'
        //    }
        //];
        //const books = StoredBooks

        // ++ MIT localStorage
        const books = Store.getBooks();

        //loop over books
        // ES5 =>   books.forEach(function(book) {.....})
        //ES6
        books.forEach((book) => UI.addBookToList(book));
    }

        static addBookToList(book) {
            const list = document.querySelector("#book-list");

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
            //Die im DOM erzeugte row der List anhängen
            list.appendChild(row)
        }

        static deleteBook(element) {
            if(element.classList.contains('delete')) {
                element.parentElement.parentElement.remove();
                //alert("Hello")
            }
        }
        //wenn im angeklickten element die Class 'delete' enthält wird das Elternteil vom Elternteil entf.
        
        //what we want => <div class"alert alert-success">Message</div>
        static showAlert(message,className) {
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div,form);
            //vanish in 3 seconds
            setTimeout(()=> document.querySelector('.alert').remove(),3000)
            

        }

        static clearfields() {
            document.querySelector('#title').value = '';
            document.querySelector('#author').value = '';
            document.querySelector('#isbn').value = '';
        }

    
}

//####################################################################################################
// Store Class: handles storage (here local storage)
// In Localstorage kann man KEINE Objecte speichern NUR strings !!!
// => vorher "stringify" und danach "parse"

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;

    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index)=> {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));

    }
}


//####################################################################################################


// Event: Display Books

document.addEventListener('DOMContentLoaded',UI.displayBooks)
// 1 comment -- ++ DOMContentLoaded ++ ist ein Event das ausgelöst wird wenn die HTML Seite fertig geladen ist 
// 2 comment -- addEventlistener('wann wird ausgelöst', was passiert)
// 3 comment --Hier in diesem Fall => sobald die HTML Seite geladen ist wird UI.displayBooks gezeigt
//UI.displayBooks => nimmt die hardcoded storedBooks iterated darüber mit forEAch loop und fügt 
//jedes einzelen book der Liste hinzu mit der addBookToList Methode


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e)=> {

        //Prevent actual submit
        e.preventDefault();

        //GET form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        //Validate a book
        if(title === '' || author ===''|| isbn ==='') {
            //alert('pls fill in all fields');
            UI.showAlert('Please fill in all fields','warning');
        } else {

        //INSTATIATE book
        const book = new Book(title,author,isbn);
        console.log(book)
        // Add Book to UI
        UI.addBookToList(book)
        // Add book to Store
        Store.addBook(book);
        // show success message
        UI.showAlert('Book added','success')
        // clear fields
        UI.clearfields();    
        }


        

    });

// Event: Remove a Book

document.querySelector('#book-list').addEventListener('click',(e)=> {
    //In der Console wird angezeigt worauf man drückt im Body
    console.log(e.target)
    // remove book from UI
    UI.deleteBook(e.target)

    // remove book from localStore
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show delete mesage
    UI.showAlert('Book deleted','danger')
})



