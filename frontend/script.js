// Inicializar el carrito desde el almacenamiento local
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const menuContainer = document.getElementById('menu-container');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const orderForm = document.getElementById('order-form'); // Obtener el formulario

// Función para mostrar el menú en la página
function displayMenu(menuData) {
    menuContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos elementos
    menuData.forEach(category => {
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.category;
        menuContainer.appendChild(categoryTitle);

        category.items.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.className = 'menu-item';
            menuItemDiv.innerHTML = `
                <div class="item-content">
                    <h3>${item.name}</h3>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price})">Añadir al Carrito</button>
            `;
            // Nota: Se escapa el nombre del item para que funcione con comillas simples en el onclick
            menuContainer.appendChild(menuItemDiv);
        });
    });
}

// Función para añadir un artículo al carrito
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// Función para actualizar el carrito en la interfaz
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="item-details">
                ${item.name} - $${item.price.toFixed(2)}
            </div>
            <div class="quantity-control">
                <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalPrice.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Guardar el carrito en el almacenamiento local
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para cambiar la cantidad de un artículo en el carrito
function changeQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.name !== name);
        }
        updateCart();
    }
}

// Función para abrir/cerrar la ventana modal del carrito
function toggleCart() {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Evento para enviar el pedido
orderForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de la forma tradicional

    const customerName = document.getElementById('customer-name').value;
    if (cart.length === 0) {
        alert("El carrito está vacío. Por favor, añade algunos productos.");
        return;
    }

    const orderData = {
        customerName: customerName,
        items: cart,
        total: parseFloat(cartTotalPrice.textContent) // Asegurarse de que el total sea un número
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`¡Gracias, ${customerName}! Tu pedido #${data.orderNumber} ha sido recibido.`);
            cart = [];
            updateCart();
            toggleCart();
            document.getElementById('customer-name').value = ''; // Limpiar campo de nombre
        } else {
            throw new Error(data.error || 'Error al procesar el pedido');
        }

    } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    }
});


// Inicializar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/menu');
        const menuData = await response.json();
        displayMenu(menuData);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
        const menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = '<p style="text-align:center; color:red;">Error al cargar el menú. Por favor, intente de nuevo más tarde.</p>';
    }
    updateCart();
});