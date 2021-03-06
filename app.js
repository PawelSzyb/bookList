// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    (this.title = title), (this.author = author), (this.isbn = isbn);
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger delete btn-sm">X</a></td>
    `;

    list.appendChild(row);
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showMessage(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// Store Class: Handle Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static deleteBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.getElementById("book-form").addEventListener("submit", e => {
  // Prevent default submit action
  e.preventDefault();
  // Get the values from form
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  // Instanciate book class
  const book = new Book(title, author, isbn);
  // Validation
  if (title === "" || author === "" || isbn === "") {
    // Show error message
    UI.showMessage("Please fill all forms", "danger");
  } else {
    // Add book
    UI.addBookToList(book);
    // Add book to a store
    Store.addBook(book);
    // Show success message
    UI.showMessage("Book added", "success");
    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.getElementById("book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from store
  const isbn = e.target.parentElement.previousElementSibling.textContent;
  Store.deleteBook(isbn);
  // Show delete message
  UI.showMessage("Book deleted", "danger");
});
