let books = [];
const booksUnread = [];
const booksRead = [];
// Variable
const BOOKS_KEY = "books-key";
const RENDER_EVENT = "render-event";

const unread = document.querySelector(".belum-dibaca");
const read = document.querySelector(".sudah-dibaca");
const unreadList = document.querySelector(".belum-dibaca .book-list");
const readList = document.querySelector(".sudah-dibaca .book-list");
const checkIcons = document.querySelectorAll(".book svg.icon-check");
const undoIcons = document.querySelectorAll(".icon-undo");
const trashIcons = document.querySelectorAll(".icon-trash");
const unreadTab = document.querySelector(".tab.unread");
const readTab = document.querySelector(".tab.read");
const addBookButton = document.querySelector(".add-button");
const destroyBookButton = document.querySelector(".destroy-button");
const addBookDialog = document.getElementById("addBookDialog");
const closeDialog = document.querySelector(".close-dialog");
const loading = document.querySelector(".loading");

// Active Tab
unreadTab.addEventListener("click", function () {
  unreadTab.classList.add("tab-active");
  readTab.classList.remove("tab-active");

  unread.classList.remove("hidden");
  read.classList.add("hidden");
});

readTab.addEventListener("click", function () {
  readTab.classList.add("tab-active");
  unreadTab.classList.remove("tab-active");

  read.classList.remove("hidden");
  unread.classList.add("hidden");
});

// Menampilkan dialog tambah buku
addBookButton.addEventListener("click", function () {
  addBookDialog.showModal();
});

closeDialog.addEventListener("click", function () {
  addBookDialog.close();
});

// check storage
function isAvailableStorage() {
  return typeof Storage !== "undefined" ? true : false;
}

// Ambil data dari storage
function getBooks() {
  if (localStorage.getItem(BOOKS_KEY) != null) {
    books.push(...JSON.parse(localStorage.getItem(BOOKS_KEY)));
  }
}

// Upload Cover Buku
async function uploadCover(cover) {
  const formdata = new FormData();
  formdata.append("key", "548f6208a7afa28175aeb0cb615a5911");
  formdata.append("image", cover);

  const postImg = await fetch("https://api.imgbb.com/1/upload", {
    method: "post",
    body: formdata,
  });
  const res = await postImg.json();
  return res.data.url;
}

// Ambil data dari input
addBookDialog.addEventListener("submit", async function (e) {
  loading.classList.add("show-loading");
  const id = +new Date();

  const judul = document.getElementById("judul").value;
  const author = document.getElementById("author").value;
  const release = document.getElementById("release").value;

  const coverFile = e.target[3].files[0];
  const url = await uploadCover(coverFile);

  const book = {
    id,
    title: judul,
    author,
    year: release,
    cover: url,
    isCompleted: false,
  };
  books.unshift(book);

  if (isAvailableStorage()) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    document.querySelector(".form").reset();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  loading.classList.remove("show-loading");
});

// Tampilkan data books
function makeBookList(book) {
  const divEl = document.createElement("div");
  divEl.classList.add("book");

  if (book.isCompleted) {
    divEl.innerHTML = `
        <span class="id-book hidden">${book.id}</span>
        <img
          src=${book.cover}
          class="book-cover"
          alt="atomic-habits"
        />
        <div class="book-desc">
          <h3 class="book-title">${book.title}</h3>
          <h5 class="book-author">${book.author}</h5>
          <span class="book-year">${book.year}</span>
        </div>
        <div class="icons">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-counterclockwise icon-undo" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash icon-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </div>
      `;
  } else {
    divEl.innerHTML = `
        <span class="id-book hidden">${book.id}</span>
        <img
          src=${book.cover}
          class="book-cover"
          alt="atomic-habits"
        />
        <div class="book-desc">
          <h3 class="book-title">${book.title}</h3>
          <h5 class="book-author">${book.author}</h5>
          <span class="book-year">${book.year}</span>
        </div>
        <div class=""icons>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle icon-check" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash icon-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </div>
      `;
  }

  return divEl;
}

// Simpan data buku ke storage
function saveBook(newBook) {
  const books = newBook;

  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Pindah ke sudah dibaca
function moveShelf(id, isCompleted) {
  for (const book of books) {
    if (book.id == id) {
      book.isCompleted = isCompleted;
    }
  }

  saveBook(books);
}

// Hapus satu buku
function deleteBook(id) {
  for (const i in books) {
    if (books[i].id == id) {
      books.splice(i, 1);
    }
  }

  saveBook(books);
}

// Hapus Semua Buku
destroyBookButton.addEventListener("click", function () {
  const isDeleted = confirm("Yakin menghapus semua buku?");

  if (isDeleted) {
    localStorage.removeItem(BOOKS_KEY);
    books = [];
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
});

document.addEventListener(RENDER_EVENT, function () {
  readList.innerHTML = "";
  unreadList.innerHTML = "";

  for (const book of books) {
    const bookEl = makeBookList(book);

    if (book.isCompleted) {
      readList.append(bookEl);
    } else {
      unreadList.append(bookEl);
    }
  }

  // Menamahkan class line pada list book
  booksUnread.push(...document.querySelectorAll(".belum-dibaca .book"));
  booksRead.push(...document.querySelectorAll(".sudah-dibaca .book"));

  for (let i = 0; i < booksUnread.length - 1; i++) {
    booksUnread[i].classList.add("line");
  }
  for (let i = 0; i < booksRead.length - 1; i++) {
    booksRead[i].classList.add("line");
  }

  // click check icon
  booksUnread.forEach((el) => {
    el.lastElementChild.firstElementChild.addEventListener(
      "click",
      function () {
        const idBook = el.firstElementChild.innerText;
        moveShelf(idBook, true);
      }
    );
  });
  // click undo icon
  booksRead.forEach((el) => {
    el.lastElementChild.firstElementChild.addEventListener(
      "click",
      function () {
        const idBook = el.firstElementChild.innerText;
        moveShelf(idBook, false);
      }
    );
  });
  function trash(el) {
    el.lastElementChild.lastElementChild.addEventListener("click", function () {
      const idBook = el.firstElementChild.innerText;
      const title =
        el.lastElementChild.previousSibling.previousSibling.firstElementChild
          .innerText;

      confirm(`Yakin mau mengahapus buku "${title}"?`) && deleteBook(idBook);
    });
  }

  // click trash icon belum dibaca
  booksUnread.forEach((el) => {
    trash(el);
  });
  // click trash icon sudah dibaca
  booksRead.forEach((el) => {
    trash(el);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (isAvailableStorage()) {
    getBooks();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
});
