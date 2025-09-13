const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); // Asegúrate de tener este paquete instalado

// Modelo de Mongoose para los pedidos
const Order = require('./models/Order'); // Asegúrate de que la ruta a tu modelo sea correcta

const app = express();
const server = http.createServer(app);

// Inicializa Socket.IO con el servidor HTTP
const io = socketIo(server, {
    cors: {
        origin: "https://yessycubanbakery-app.onrender.com",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json()); // Para parsear el cuerpo de las peticiones en formato JSON
app.use(cors()); // Habilita CORS para permitir peticiones desde tu frontend en Render

// Conexión a la base de datos de MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yessycubanbakery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos de MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Ruta para servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static('public')); // Asegúrate de que tu carpeta de archivos estáticos se llame 'public'

// Ruta para obtener el menú
app.get('/api/menu', async (req, res) => {
    try {
        // En este ejemplo, el menú no se carga desde la base de datos.
        // Si tu menú está en la base de datos, debes obtenerlo aquí.
        const menu = [
            // Tu data de menú aquí, o simplemente la dejas vacía si la obtienes de MongoDB.
        ];
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar el menú' });
    }
});

// ⚡️ RUTA CRUCIAL: Manejar los nuevos pedidos ⚡️
app.post('/api/orders', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments({});
        const newOrder = new Order({
            ...req.body,
            orderNumber: orderCount + 1,
            status: 'pendiente'
        });
        await newOrder.save();
        
        // 🚀 EMITIR EVENTO DE SOCKET.IO DESPUÉS DE GUARDAR EL PEDIDO 🚀
        io.emit('newOrder', newOrder);
        
        res.status(201).json({ 
            orderNumber: newOrder.orderNumber,
            message: 'Pedido recibido'
        });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ error: 'Error al procesar el pedido' });
    }
});

// Ruta para obtener todos los pedidos existentes (para la página de la cocina)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'pendiente' }).sort({ orderNumber: 1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

// Ruta para eliminar un pedido (marcarlo como completado)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const result = await Order.findByIdAndDelete(orderId); // O cambia el status a "completado"
        if (!result) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        // 🚀 EMITIR EVENTO DE SOCKET.IO PARA NOTIFICAR A LOS CLIENTES SOBRE EL PEDIDO REMOVIDO 🚀
        io.emit('orderRemoved', orderId);
        
        res.status(200).json({ message: 'Pedido completado y eliminado' });
    } catch (error) {
        console.error('Error al completar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Manejador de la conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Si necesitas manejar más eventos, agrégalos aquí.
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
