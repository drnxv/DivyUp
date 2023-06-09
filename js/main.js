let left = document.getElementById('left')
let right = document.getElementById('right')
let person = document.getElementById('name')
let calc = document.getElementById('calc')
let input = document.querySelector('input[type="file"]')
let iname = document.querySelector('input[type="text"]')
let names = document.getElementById('names')
let setF = document.getElementById('setFriends')

let receipt = document.querySelector('div.receipt')
let bill = document.querySelector('div.bill')
let total_calcs = document.querySelector('div.total_calcs')
let friends = document.querySelector('div.friends')

function Item(name, qty, price) {
  let item = document.createElement('div')
  let t1 = document.createElement('span')
  let t2 = document.createElement('span')

  item.classList.add('item')
  if (qty == 1)
    t1.innerText = name
  else
    t1.innerText = `${name} × ${qty}`
  t2.innerText = '$' + price

  item.appendChild(t1)
  item.appendChild(t2)

  return {item:item, contrib:[], price:price, qty:qty}
}

list = []
items = []
id = 0
tax = 0

function rot(i) {
  id = id + i == -1 ? (list.length - 1) : (id + i) % list.length
  return id
}

function toggleItem(i) {
  if (i.item.classList.toggle('selected'))
    //add
    i.contrib.push(list[id])
  else
    //delete
    i.contrib.splice(i.contrib.indexOf(list[id]), 1)
}

let setPerson = id => {
  person.innerText = list[id]
  items.forEach(i => {
    let a = i.contrib.includes(list[id])
    let b = i.item.classList.contains('selected')
    //XOR
    if (a ? !b : b) i.item.classList.toggle('selected')
  })
}

function compute(items, tax, ppl) {
  let costs = {}
  for (const i of items) {
    for (const p of i.contrib) {
      if (!(p in costs)) costs[p] = 0
      costs[p] += i.price * i.qty / i.contrib.length
    }
  }
  // split tax evenly
  for (const p in costs) {
    if (Object.hasOwnProperty.call(costs, p)) {
      costs[p] += (tax / ppl)
    }
  }
  return costs
}

function showSplits(items, tax, ppl) {
  let ret = ''
  let costs = compute(items, tax, ppl)
  let table = document.createElement('table')
  let headerRow = table.insertRow()
  let header1 = headerRow.insertCell(0)
  header1.innerText = 'Name'
  header1.style.fontWeight = 'bold'
  let header2 = headerRow.insertCell(1)
  header2.innerText = 'Amount'
  header2.style.fontWeight = 'bold'

  for (var person in costs) {
    let row = table.insertRow()
    let cell1 = row.insertCell(0)
    cell1.innerText = person
    let cell2 = row.insertCell(1)
    cell2.innerText = '$' + costs[person].toFixed(2)
    cell2.style.textAlign = 'center'
  }

  total_calcs.appendChild(table)

  return ret
}

window.onload = () => {
  
  input.onchange = async () => {
    var data = new FormData()
    data.append('receipt', input.files[0])

    let r = await fetch('/ocr', {
      method: 'POST',
      body: data
    })
    let json = await r.json()
    // add data
    tax = json.tax
    for (let i = 0; i < json.items.length; i++)
      items.push(Item(json.items[i], json.qty[i], json.prices[i]))
    
    items.forEach(i => {
      i.item.onclick = () => toggleItem(i)
    })

    let b = document.getElementById('items')
    for (const i of items) b.appendChild(i.item)

    // transition
    receipt.classList.toggle('off')
    friends.classList.toggle('off')
  }

  iname.onkeyup = ({key}) => {
    if (key === "Enter" && iname.value.length > 0) {
      let sp = document.createElement('span')
      sp.innerText = iname.value
      sp.onclick = () => sp.remove()
      names.appendChild(sp)
      iname.value = ''
    }
  }

  setF.onclick = () => {
    document.querySelectorAll('div#names > span').forEach(s => list.push(s.innerText))
    setPerson(id)
    // transition
    friends.classList.toggle('off')
    bill.classList.toggle('off')
  }

  left.onclick = () => setPerson(rot(-1))
  right.onclick = () => setPerson(rot(1))
  
  calc.onclick = () => {

    bill.classList.toggle('off')
    total_calcs.classList.toggle('off')

    document.getElementById('names_costs').innerHTML = 'Here\'s what each person pays \n'
    showSplits(items, tax, list.length)
  }
}