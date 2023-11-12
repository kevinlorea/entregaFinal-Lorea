
let instruments = [];


fetch('data.json')
  .then(response => response.json())
  .then(data => {
    instruments = data;
    displayInstruments(instruments);
  })
  .catch(error => console.log('Error al obtener los instrumentos: ', error));


function displayInstruments(instruments) {
  const instrumentsDiv = document.getElementById('instruments');

  instruments.forEach(instrument => {
    const card = document.createElement('div');
    card.innerHTML = `
      <h3>${instrument.name}</h3>
      <img src="${instrument.image}" alt="${instrument.name}">
      <p>Precio: USD ${instrument.price}</p>
      <button onclick="addToCart(${instrument.id})">Agregar al carrito</button>
    `;
    instrumentsDiv.appendChild(card);
  });
}


let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(instrumentId) {
    const selectedInstrument = instruments.find(instrument => instrument.id === instrumentId);

  if (selectedInstrument) {
    cart.push(selectedInstrument);
    displayCart();
    saveCartToLocalStorage();
  }
}

function searchInstrument(keyword) {
  const searchResult = instruments.filter(instrument => {
    return instrument.name.toLowerCase().includes(keyword.toLowerCase());
  });

  if (searchResult.length > 0) {

    Swal.fire({
      icon: 'success',
      title: 'Productos encontrados',
      text: `Se encontraron ${searchResult.length} productos que coinciden con "${keyword}".`,
    });
    console.log(searchResult);
  } else {

    Swal.fire({
      icon: 'error',
      title: 'Productos no encontrados',
      text: `No hay productos que coincidan con "${keyword}".`,
    });
  }
}


function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price;
  });
  return total;
}


function displayCart() {
  const cartList = document.getElementById('cart');
  cartList.innerHTML = '';

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerText = `${item.name}: USD ${item.price}`;
    cartList.appendChild(li);
  });

  const total = calculateTotal();
  const totalElement = document.createElement('li');
  totalElement.innerText = `Total: USD ${total}`;
  cartList.appendChild(totalElement);
}

function checkout() {
    if (cart.length > 0) {
      Swal.fire({
        icon: 'success',
        title: '¡Compra realizada!',
        text: 'Instrument storage agradece tu compra.',
      });
      cart = []; 
      saveCartToLocalStorage();
      displayCart();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay elementos en el carrito para comprar.'
      });
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById('searchButton').addEventListener('click', searchHandler);
document.getElementById('buyButton').addEventListener('click', checkout);
    
function searchHandler() {
    const searchKeyword = document.getElementById('searchInput').value.trim();
    
    if (searchKeyword !== "") {
      searchInstrument(searchKeyword);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una palabra para buscar.'
      });
    }
}
