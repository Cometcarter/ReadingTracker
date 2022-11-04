var ratingbtn = document.getElementsByClassName("rating-btn")
var trash = document.getElementsByClassName("fa-trash")
var favbtn = document.getElementsByClassName("fav-btn")


//adds eventListener to all submissions not just the first one vvv
Array.from(ratingbtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const title = this.parentNode.parentNode.childNodes[3].innerText.trim()
    const author = this.parentNode.parentNode.childNodes[5].innerText.trim()
    const rating = parseInt(this.parentNode.querySelector('input[name=ratingchoice]:checked').value)
    const variable = this.parentNode.parentNode.classList.contains('activeitem')
    console.log(author)
    console.log(title)
    fetch('rating', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'title': title,
        'author': author,
        'rating': rating
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  })
})

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const title = this.parentNode.parentNode.childNodes[1].innerText
    const author = this.parentNode.parentNode.childNodes[3].innerText
    const rating = parseInt(this.parentNode.querySelector('input[name=ratingchoice]:checked'))
    console.log(title)
    console.log(rating)
    fetch('books', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'title': title,
        'author': author,
        'rating': rating
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

Array.from(favbtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const title = this.parentNode.parentNode.childNodes[3].innerText.trim()
    const author = this.parentNode.parentNode.childNodes[5].innerText.trim()
    console.log(author)
    console.log(title)
    fetch('favorite', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'title': title,
        'author': author,
        'favorite': true
      })
    })
      // .then(response => {
      //   if (response.ok) return response.json()
      // })
      .then(data => {
        console.log(data)
        location = '/favorite'
      })
  })
})



//if fav button is clicked
// function favoriteBtnPressed(element) {
//   if (element.target.classList.contains('fav-btn')) {
//     if (element.target.classList.contains('favorited')) {
//       //remove class
//       console.log('remove')
//       element.target.classList.remove('favorited')
//     } else {
//       console.log('add')
//       element.target.classList.add('favorited')
//     }
//   }
// }