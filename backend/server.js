// Cargar las variables de entorno del archivo .env
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir todas las conexiones para el desarrollo
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Sirve los archivos estáticos del frontend desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Datos del menú
const menu = [
    {
        category: "Bandejas de Party",
        items: [
            { name: "Bandeja de 25 Bocaditos", price: 11.75 },
            { name: "Bandeja de 25 Croqueticas de Jamon (Party)", price: 11.75 },
            { name: "Bandeja de 25 Pastel Guayaba (Party)", price: 11.75 },
            { name: "Bandeja de 25 Pastel Queso (Party)", price: 11.75 },
            { name: "Bandeja 25 Pastel Coco (Party)", price: 11.75 },
            { name: "Bandeja 25 Mini Papa Rellena (Party)", price: 27.99 },
            { name: "Bandeja 25 Pastel Guayaba y queso (Party)", price: 11.75 },
            { name: "Bandeja 25 Pastel de Carne (Party)", price: 11.75 }
        ]
    },
    {
        category: "Cakes",
        items: [
            { name: "Cake chocolate 15 Personas", price: 35.00 },
            { name: "Cake chocolate 25 Personas", price: 45.00 },
            { name: "Cake dulce Leche 15 Personas", price: 35.00 },
            { name: "Cake Dulce Leche 25 Personas", price: 45.00 },
            { name: "Cake Natilla 15 Personas", price: 35.00 },
            { name: "Cake Natiila 25 Personas", price: 45.00 }
        ]
    },
    {
        category: "Batidos",
        items: [
            { name: "Batido de Guanabana", price: 4.50 },
            { name: "Batido de Papaya", price: 4.50 },
            { name: "Batido de Mamey", price: 4.50 },
            { name: "Batido de Mango", price: 4.50 },
            { name: "Batido de Guayaba", price: 4.50 },
            { name: "Batido de Maracuya", price: 4.50 },
            { name: "Batido de Fresa", price: 5.85 },
            { name: "Batido De Malteada", price: 5.85 },
            { name: "Batido De Trigo", price: 5.85 },
            { name: "Batido De Platanito", price: 5.85 },
            { name: "Batido De Pina", price: 5.85 }
        ]
    },
    {
        category: "Bebidas",
        items: [
            { name: "Agua", price: 1.25 },
            { name: "Agua de Coco", price: 1.99 },
            { name: "Aloe De Vera", price: 4.25 },
            { name: "Caprisum", price: 1.25 },
            { name: "Gatorade", price: 2.25 },
            { name: "Jarritos", price: 2.25 },
            { name: "Sunny D", price: 1.45 },
            { name: "Agua Perrier", price: 1.99 },
            { name: "Malta India", price: 2.40 },
            { name: "Limonada 52 oz", price: 4.25 },
            { name: "Burst Tropical Banana Soda 2LT", price: 2.99 },
            { name: "Burst Tropical Soda Banana 16 oz", price: 1.25 },
            { name: "Monster", price: 3.99 },
            { name: "Red Bull", price: 3.99 },
            { name: "Tiky 20 oz", price: 2.50 },
            { name: "Galon de Leche", price: 5.99 },
            { name: "Coca Cola", price: 1.75 },
            { name: "Coca Cola de Dieta", price: 1.75 },
            { name: "Ironbeer", price: 1.75 },
            { name: "Jupina", price: 1.75 },
            { name: "Materva", price: 1.75 },
            { name: "Pepsi", price: 1.75 },
            { name: "Sprite", price: 1.75 },
            { name: "Soda 2 LT", price: 3.99 }
        ]
    },
    {
        category: "Cafes",
        items: [
            { name: "Cafe con Leche Large", price: 3.99 },
            { name: "Cafe con Leche Small", price: 2.99 },
            { name: "Cafe con leche mediun", price: 3.50 },
            { name: "Leche con Chocolate Large", price: 4.50 },
            { name: "Leche con Chocolate Mediun", price: 3.99 },
            { name: "Leche con Chocolate Small", price: 3.50 },
            { name: "Cafe Americano Small", price: 1.59 },
            { name: "Cafe Americano Mediano", price: 1.99 },
            { name: "Cafe Americano large", price: 2.50 },
            { name: "Colada", price: 1.99 },
            { name: "Cortadito", price: 1.99 },
            { name: "Media Colada", price: 1.25 },
            { name: "Taza de Cafe", price: 1.80 }
        ]
    },
    {
        category: "Croquetas",
        items: [
            { name: "Croquetas de Jamon", price: 1.25 },
            { name: "Croquetas de Queso", price: 1.25 },
            { name: "Croquetas de Pollo", price: 1.25 },
            { name: "Croquetas de Bacalao de la Casa", price: 1.40 },
            { name: "Croquetas De Chorizo", price: 1.25 },
            { name: "Croqueta de Jamon de la casa", price: 1.50 }
        ]
    },
    {
        category: "Sandwiches",
        items: [
            { name: "Sandwich Bacon huevo y queso", price: 11.68 },
            { name: "Sandwich Jamon, queso, bacon y dos huevos", price: 9.50 },
            { name: "Sandwich de Jamon, Queso y 2 Huevo", price: 8.25 },
            { name: "Croissant Huevo, Queso, Y Bacon", price: 9.99 },
            { name: "Sandwich Bacon huevo y queso", price: 8.99 },
            { name: "Ham and Cheese Sandwich", price: 8.25 },
            { name: "Cuban Sandwich", price: 9.99 },
            { name: "Hamburger Sandwich", price: 8.99 },
            { name: "Midnight Sandwich", price: 9.99 },
            { name: "Steak Sandwich", price: 11.99 },
            { name: "Croqueta Sandwich", price: 7.99 },
            { name: "Croquetta Sandwich de Bacalo", price: 11.99 },
            { name: "Sandwich de Bistec a Caballo", price: 13.99 },
            { name: "Sandwich de Frita Cubana", price: 8.99 },
            { name: "Pork Sandwich", price: 9.99 },
            { name: "Chicken Sandwich", price: 8.99 },
            { name: "Sandwich de Croqueta Preparada", price: 10.99 },
            { name: "Fish Sandwich", price: 11.99 },
            { name: "Croasant de huevo queso y bacon", price: 9.00 },
            { name: "Croasant de Jamon queso huevo y bacon", price: 8.25 },
            { name: "Croasant de jamon y queso", price: 6.99 },
            { name: "Croasant jamon queso y huevo", price: 8.75 },
            { name: "Bistec a caballo al plato", price: 12.99 },
            { name: "Bistec adicional", price: 6.99 },
            { name: "Bistec solo con pan", price: 9.99 },
            { name: "Pollo Frito con Papas", price: 7.99 }
        ]
    },
    {
        category: "Dulces Finos",
        items: [
            { name: "Arroz con Leche", price: 2.50 },
            { name: "Capuchino", price: 5.50 },
            { name: "Eclair de Chocolote", price: 3.99 },
            { name: "Flan Grande", price: 7.99 },
            { name: "Flan Pequeno", price: 2.25 },
            { name: "Senorita", price: 3.99 },
            { name: "Torrejas", price: 1.99 },
            { name: "Buruba Leche", price: 3.99 },
            { name: "Mantecado", price: 1.25 },
            { name: "Merengue", price: 0.99 },
            { name: "Porcion De Cheesecake Dulce De Leche", price: 3.99 },
            { name: "Porcion De Pudin", price: 3.99 },
            { name: "Pudin Entero", price: 7.99 },
            { name: "San Fransisco Individual", price: 1.50 },
            { name: "Cokies", price: 0.99 },
            { name: "Crema De Catalana", price: 3.99 },
            { name: "Cuatro Leche Chiquito", price: 3.99 },
            { name: "Cuatro Leche Grande", price: 7.99 },
            { name: "Brazo Gitano", price: 16.99 },
            { name: "Bunuelo", price: 1.99 },
            { name: "Cabezote Individual", price: 1.50 },
            { name: "Cake Napolitano", price: 16.99 },
            { name: "Calabaza China", price: 7.99 },
            { name: "Eclair de Vainilla", price: 3.99 },
            { name: "Eclair de Dulce Leche", price: 3.99 },
            { name: "Marquesitas", price: 3.99 },
            { name: "Panetela Borracha", price: 1.75 },
            { name: "Porcion de Cheesecake de Guayaba", price: 3.99 },
            { name: "Rollitos", price: 3.99 },
            { name: "Case San Fransisco", price: 4.99 },
            { name: "Tatianoff", price: 16.99 },
            { name: "Case Sponrry", price: 3.99 },
            { name: "Tartaletas", price: 2.99 },
            { name: "Tres Leche", price: 3.99 },
            { name: "Tres Leche Big", price: 7.99 },
            { name: "Tiramisu", price: 3.99 },
            { name: "Case de Capuchino", price: 5.50 }
        ]
    },
    {
        category: "Empanadas",
        items: [
            { name: "Todas las empanadas son $3.35", price: 3.35 },
            { name: "Empanada de Pollo", price: 4.35 },
            { name: "Empanada de Jamon y Queso", price: 4.35 },
            { name: "Empanada de Carne", price: 4.35 },
            { name: "Empanada de Chorizo", price: 4.35 },
            { name: "Empanada de Espinaca y Queso", price: 4.22 },
            { name: "Empanada de Pizza", price: 4.35 }
        ]
    },
    {
        category: "Jugos de Mi Pais",
        items: [
            { name: "Jugo de Mango", price: 2.81 },
            { name: "Jugo de Naranja Zanahoria", price: 2.81 },
            { name: "Jugo de Guanabana", price: 2.81 },
            { name: "Jugo de Guayaba", price: 2.81 },
            { name: "Mango Passion Juice", price: 2.81 },
            { name: "Mango Peach Juice", price: 2.81 },
            { name: "Jugo de Maranon", price: 2.81 },
            { name: "Jugo de Pina Coco", price: 2.81 },
            { name: "Strawberry Banana Juice", price: 2.81 },
            { name: "Jugo de Tamarindo", price: 2.81 },
            { name: "Jugo de Fresa", price: 2.81 },
            { name: "Jugo de Melon", price: 2.81 },
            { name: "Jugo de Mamey", price: 2.81 },
            { name: "Pina Pineapple", price: 2.25 },
            { name: "Leche de coco Small", price: 2.06 },
            { name: "Leche de coco Grande", price: 2.99 }
        ]
    },
    {
        category: "Panes",
        items: [
            { name: "Pan Cubano", price: 1.70 },
            { name: "Bolsa De Tostadas", price: 1.50 },
            { name: "Pan Entero con Mantequilla", price: 5.99 },
            { name: "Pan de Media Noche", price: 2.99 },
            { name: "Palitroque", price: 1.99 },
            { name: "Galletas Cubanas", price: 1.99 },
            { name: "Pan De Queso", price: 6.25 },
            { name: "Pan Entero con Mayonesa", price: 5.99 },
            { name: "Pan Bolito", price: 1.99 },
            { name: "Croasant Individual", price: 1.99 }
        ]
    },
    {
        category: "Otros",
        items: [
            { name: "Mini Papa Rellena", price: 1.75 },
            { name: "Papa Rellena Regular", price: 2.99 },
            { name: "Yuca Rellena", price: 2.99 },
            { name: "Chicken Tender and Fries Combo", price: 7.99 },
            { name: "Chicken Tenderloins", price: 6.99 },
            { name: "Tequeno de queso", price: 1.35 },
            { name: "Pan de Bono", price: 1.45 },
            { name: "Papas Fritas", price: 2.99 },
            { name: "Ensalada Fria", price: 4.99 },
            { name: "Tamal con Chicharones", price: 9.99 },
            { name: "Tamal cubano", price: 4.99 }
        ]
    },
    {
        category: "Pasteles Cubanos",
        items: [
            { name: "Pastel de Coco", price: 1.88 },
            { name: "Pastel de Carne", price: 1.88 },
            { name: "Pastel de Guayaba", price: 1.88 },
            { name: "Pastel de Guayaba y Queso", price: 1.88 },
            { name: "Pastel de Queso", price: 1.88 },
            { name: "Pastel de Coco y Queso", price: 1.88 },
            { name: "Pastel de Fresa", price: 1.88 },
            { name: "pastel de pina", price: 1.88 },
            { name: "Pastel de Pina y Coco", price: 1.88 }
        ]
    },
    {
        category: "Pizza Personal",
        items: [
            { name: "Pizza Aji", price: 7.99 },
            { name: "Pizza Bacon", price: 8.99 },
            { name: "Pizza Cebolla", price: 7.99 },
            { name: "Pizza chorizo", price: 8.99 },
            { name: "Pizza Jamon y Queso", price: 8.99 },
            { name: "Pizza Hawaiian", price: 8.99 },
            { name: "Pizza de Jamon", price: 7.99 },
            { name: "Pizza Pepperoni", price: 7.99 },
            { name: "Pizza Queso", price: 6.99 }
        ]
    },
    {
        category: "Desayunos",
        items: [
            { name: "Dos Huevos Fritos con Pan", price: 6.99 },
            { name: "Extra Bacon", price: 1.99 },
            { name: "Huevo Revuelto Con Jamon Y Tostada Con Mantequilla", price: 7.99 },
            { name: "Pan con Tortilla", price: 8.99 },
            { name: "Tortilla Individual", price: 7.99 },
            { name: "Tostada con Queso suizo", price: 5.99 },
            { name: "Extras Regular c/u", price: 1.00 },
            { name: "Racion de Bacon", price: 2.99 },
            { name: "Tostada de Queso Crema", price: 5.99 },
            { name: "Desayuno Completo", price: 10.99 },
            { name: "Huevo Frito Individual", price: 2.50 },
            { name: "Huevo Revuelto con jamon sin Tostada", price: 7.99 },
            { name: "Sandwich de Jamon, Queso y 2 Huevo", price: 8.25 },
            { name: "Tostada Con Mantequila", price: 3.99 },
            { name: "Croissant Huevo, Queso, Y Bacon", price: 9.99 },
            { name: "Huevo Frito y Tostada con Mantequilla", price: 6.99 },
            { name: "Sandwich Bacon huevo y queso", price: 8.99 },
            { name: "Tortilla de Bacon", price: 10.99 },
            { name: "Tostada con pasta de Bocadito", price: 5.99 }
        ]
    },
    {
        category: "Sopas",
        items: [
            { name: "Ajiaco Cubano Small", price: 5.99 },
            { name: "Ajiaco Cubano Large", price: 9.99 },
            { name: "Sopa de Pollo Small", price: 5.99 },
            { name: "Sopa de Pollo Large", price: 9.99 }
        ]
    }
];

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

// Esquema y Modelo para los pedidos
const orderSchema = new mongoose.Schema({
    orderNumber: { type: Number, required: true, unique: true },
    customerName: { type: String, required: true },
    items: { type: Array, required: true },
    status: { type: String, default: 'pendiente' }, // Estados: 'pendiente', 'en_preparacion', 'listo'
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Endpoint para obtener el menú
app.get('/api/menu', (req, res) => {
    res.json(menu);
});

// Endpoint para recibir un nuevo pedido (el frontend lo llamará)
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, items } = req.body;

        // Encontrar el último número de orden y generar el siguiente
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
        const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

        const newOrder = new Order({
            orderNumber: newOrderNumber,
            customerName,
            items
        });

        await newOrder.save();

        // Emitir el nuevo pedido a todos los clientes conectados (la pantalla de la cocina)
        io.emit('newOrder', newOrder);

        res.status(201).json({ 
            message: "Pedido recibido exitosamente",
            orderNumber: newOrderNumber 
        });

    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para obtener todos los pedidos (para la pantalla de la cocina)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: 1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Nuevo Endpoint para eliminar un pedido (cuando está entregado/pagado)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Emitir un evento para notificar a todos los clientes que un pedido ha sido eliminado
        io.emit('orderRemoved', orderId);

        res.status(200).json({ message: "Pedido eliminado exitosamente" });

    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});