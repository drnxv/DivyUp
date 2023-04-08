let items = document.querySelectorAll('div.item')
let left = document.getElementById('left')
let right = document.getElementById('right')
let person = document.getElementById('name')
list = ['Pranav C', 'Pranav P', 'Panda', 'Varun']
id = 0

items.forEach(item => {
  item.onclick = () => item.classList.toggle('selected')
})

function rot(i) {
  id = id + i == -1 ? 3 : (id + i) % 4
  return id
}

let setPerson = id => person.innerText = list[id]

setPerson(id)

left.onclick = () => setPerson(rot(-1))
right.onclick = () => setPerson(rot(1))

