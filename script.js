console.log("script connected")

fetch('https://openapi.programming-hero.com/api/plants') 
.then(res => res.json())
.then(data => {
    console.log(data)
})
.catch(err => {
    console.log(err)
})