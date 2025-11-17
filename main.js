function addCard(title, img, valueBtn) {
    const row = document.querySelector(".row");
    const col = document.createElement('div');
    const cardDiv = document.createElement('div');
    const cardHeader = document.createElement('div');
    const titleCard = document.createElement('p')
    const imgCard = document.createElement('img')
    const cardBody = document.createElement('div');
    const btnView = document.createElement('btn');
    // fathers
    col.className = 'col d-flex justify-content-center'
    cardDiv.className = 'card'
    // header
    cardHeader.className = 'card-title d-flex flex-column justify-content-center'
    titleCard.className = 'text-center fs-2'
    imgCard.className = 'img-fluid'
    // end header
    // body
    cardBody.className = 'card-body text-center'
    btnView.className = 'btn info-book fs-4'
    btnView.setAttribute('data-bs-toggle','modal')
    btnView.setAttribute('data-bs-target','#staticBackdrop')
    // end body

    // set dynamics value
    titleCard.innerHTML = String(title).length > 4 ? title.slice(0,9) + '...' : title
    imgCard.srcset = img
    btnView.innerHTML = 'Ver Mais'
    btnView.setAttribute('id-book', valueBtn)


    // add tags for html
    cardHeader.appendChild(titleCard);
    cardHeader.appendChild(imgCard);
    cardBody.appendChild(btnView)
    cardDiv.appendChild(cardHeader)
    cardDiv.appendChild(cardBody)
    col.appendChild(cardDiv)
    row.appendChild(col)
}

function listenerInfosBooks(){
    document.querySelectorAll('.info-book').forEach(btn => {
        btn.addEventListener('click', ()=>{
            console.log(btn.getAttribute('id-book'))
            // query
            fetch(`https://www.googleapis.com/books/v1/volumes/${btn.getAttribute('id-book')}`)
            .then(query => query.json())
            .then(data=>{
                let writers = null;
                if(data.volumeInfo.authors)
                data.volumeInfo.authors.forEach(authors => {
                    writers = writers === null ? authors : writers+' / '+authors;
                });

                setModal(data.volumeInfo.title, writers ?? 'Não informado', data.volumeInfo.publisher, data.volumeInfo.description ?? 'Não informado')
            })
        })
    })
}

function setModal(title, writer, publisher, synopsis){
    document.querySelector("#title-book").innerHTML = document.querySelector("#title-book").innerHTML + ' ' + title
    document.querySelector("#writer-book").innerHTML = document.querySelector("#writer-book").innerHTML + ' ' + writer
    document.querySelector("#publisher-book").innerHTML = document.querySelector("#publisher-book").innerHTML + ' ' + publisher
    document.querySelector("#synopsis-book").innerHTML = document.querySelector("#synopsis-book").innerHTML + ' ' + synopsis
}

function getBooks(link){
    const query = fetch(link);
    query.then(query => query.json())
    .then(data=>{
        console.log(data)
        books = data.items ?? null
        const loading = document.querySelector(".loading");
        books.forEach(book => {
            console.log(book.id)
            addCard(book.volumeInfo.title, book.volumeInfo.imageLinks.thumbnail, book.id)
        });
        loading.style = 'display: none !important'
        document.querySelector(".row").style = ''
        document.querySelector('.arrows-btn-back').style = '' ;
        document.querySelector('.arrows-btn-next').style = '';
        listenerInfosBooks()
    });
}

function pagination(linkNotStartIndex ,numberPage, maxResults){
    startIndex = (numberPage - 1) * maxResults;
    link = linkNotStartIndex + `&startIndex=${startIndex}`
    getBooks(link);
}
getBooks('https://www.googleapis.com/books/v1/volumes?q=a&maxResults=18&startIndex=0')

// arrows pagination
// retriever
document.querySelector('.arrows-btn-back').addEventListener('click',()=>{
    const btn = document.querySelector('.arrows-btn-back')
    if(btn.value === '1') return
    document.querySelector(".loading").style = ''
    document.querySelector(".row").style = 'display:none'
    document.querySelector('.arrows-btn-back').style = 'display:none' ;
    document.querySelector('.arrows-btn-next').style = 'display:none';
    const row = document.querySelector(".row");
    row.innerHTML = '';
    if(btn.value === '2'){
        getBooks('https://www.googleapis.com/books/v1/volumes?q=a&maxResults=18&startIndex=0');
        document.querySelector('.arrows-btn-back').value = 1 ;
        document.querySelector('.arrows-btn-next').value = 2;
        return;
    };
    pagination('https://www.googleapis.com/books/v1/volumes?q=a&maxResults=18',btn.value, 18);
            document.querySelector('.arrows-btn-back').value = parseInt(btn.value) - 1;
            document.querySelector('.arrows-btn-next').value = parseInt(btn.value);
            return;
})
// prox
document.querySelector('.arrows-btn-next').addEventListener('click',()=>{
    document.querySelector(".loading").style = ''
    document.querySelector(".row").style = 'display:none'
    document.querySelector('.arrows-btn-back').style = 'display:none' ;
    document.querySelector('.arrows-btn-next').style = 'display:none';
    const btn = document.querySelector('.arrows-btn-next')
    const row = document.querySelector(".row");
    row.innerHTML ='';
    pagination('https://www.googleapis.com/books/v1/volumes?q=a&maxResults=18',btn.value, 18);
    document.querySelector('.arrows-btn-back').value = parseInt(btn.value);
    document.querySelector('.arrows-btn-next').value  = parseInt(btn.value) + 1;
    return;
})

document.querySelector(".btn-close-modal").addEventListener("click",()=>{
      document.querySelector("#title-book").innerHTML = 'Título :'
    document.querySelector("#writer-book").innerHTML = 'Autor :'
    document.querySelector("#publisher-book").innerHTML = 'Editora :'
    document.querySelector("#synopsis-book").innerHTML = 'Descrição :'
})

// addCard('Lorem Ipsum','http://books.google.com/books/content?id=q6BVCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api')