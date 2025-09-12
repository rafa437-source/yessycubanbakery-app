const ordersContainer = document.getElementById('orders-container');
const noOrdersMessage = document.getElementById('no-orders-message');

// Conectar al servidor de Socket.IO
const socket = io('http://localhost:5000');

// Función para mostrar los pedidos en la interfaz
function displayOrder(order) {
    if (noOrdersMessage) {
        noOrdersMessage.style.display = 'none';
    }

    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.dataset.orderId = order._id; // Guardamos el ID del pedido en el elemento HTML
    orderCard.innerHTML = `
        <div class="order-header">
            <span class="order-number">#${order.orderNumber}</span>
            <span class="customer-name">${order.customerName}</span>
        </div>
        <ul class="order-items">
            ${order.items.map(item => `<li>${item.quantity} x ${item.name}</li>`).join('')}
        </ul>
        <button class="complete-btn" onclick="completeOrder('${order._id}')">
            Pedido Completado
        </button>
    `;

    ordersContainer.prepend(orderCard); // Añadir el nuevo pedido al principio
}

// Función para enviar la solicitud de "pedido completado" al backend
async function completeOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al marcar el pedido como completado.');
        }

        console.log(`Pedido ${orderId} marcado como completado.`);

    } catch (error) {
        console.error('Error al completar el pedido:', error);
        alert('Hubo un error al marcar el pedido como completado.');
    }
}

// Escuchar el evento 'newOrder' del servidor
socket.on('newOrder', (newOrder) => {
    console.log('Nuevo pedido recibido:', newOrder);
    displayOrder(newOrder);
});

// Escuchar el evento 'orderRemoved' del servidor y eliminar el pedido del DOM
socket.on('orderRemoved', (orderId) => {
    console.log('Pedido para eliminar:', orderId);
    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    if (orderCard) {
        orderCard.remove();
    }
    // Si no quedan pedidos, muestra el mensaje
    if (ordersContainer.children.length === 0) {
        if (noOrdersMessage) {
            noOrdersMessage.style.display = 'block';
        }
    }
});

// Función para obtener los pedidos existentes al cargar la página
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/orders');
        const orders = await response.json();

        if (orders.length > 0) {
            orders.forEach(order => displayOrder(order));
        }
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
}

// Cargar los pedidos al iniciar la página
document.addEventListener('DOMContentLoaded', fetchOrders);