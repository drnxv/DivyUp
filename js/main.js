let left = document.getElementById('left')
let right = document.getElementById('right')
let person = document.getElementById('name')
let calc = document.getElementById('calc')

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

list = ['Pranav C', 'Pranav P', 'Panda', 'Varun']
items = [Item('item a', 1, 3.99), Item('item b', 2, 4.99)]
id = 0

function rot(i) {
  id = id + i == -1 ? 3 : (id + i) % 4
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

function roundTo(n, place) {
  return +(Math.round(n + 'e+' + place) + 'e-' + place);
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
  let p1 = null 
  for (var person in costs) {
    p1 = document.createElement('span')
    p1.innerText = ret += person + ' -> ' + '$' + costs[person].toFixed(2) + '\n'
  }

  document.querySelector('div.total_calcs').appendChild(p1)

  return ret
}

window.onload = () => {
  items.forEach(i => {
    i.item.onclick = () => toggleItem(i)
  })

  setPerson(id)
  left.onclick = () => setPerson(rot(-1))
  right.onclick = () => setPerson(rot(1))

  let bill = document.getElementById('items')
  for (const i of items) bill.appendChild(i.item)
  
  calc.onclick = () => {
    let costs = compute(items, 2.40, list.length)
    document.querySelector('div.bill').style.display = 'none';
    document.querySelector('div.total_calcs').style.display = 'flex';
    // showSplits(items, 2.40, list.length)
    // let pplCost = showSplits(items, 2.40, list.length)
    // document.getElementById('names_costs').innerHTML = pplCost
    document.getElementById('names_costs').innerHTML = 'Here\'s what each person pays \n'
    showSplits(items, 2.40, list.length)
  }
}

