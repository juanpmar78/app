import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';

// Formatea un número como pesos: 15000 -> $15.000
const formatoPesos = (valor) =>
  '$' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function App() {
  // ---------- ESTADOS (useState) ----------
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' }); // tipo: 'error' | 'ok'
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const [contador, setContador] = useState(0);

  // ---------- EVENTO: REGISTRAR ----------
  const registrarPedido = () => {
    const errores = [];

    // 1. Validar nombre y producto (vacío o solo espacios)
    if (cliente.trim() === '') {
      errores.push('Debe ingresar el nombre del cliente');
    }
    if (producto.trim() === '') {
      errores.push('Debe ingresar un producto');
    }

    // 2. Validar cantidad: solo dígitos (sin decimales, negativos ni letras) y > 0
    const cantidadTxt = cantidad.trim();
    const cantidadValida =
      /^\d+$/.test(cantidadTxt) && Number(cantidadTxt) > 0;
    if (!cantidadValida) {
      errores.push('Ingrese una cantidad válida');
    }

    // 3. Validar precio unitario: número mayor que 0
    const precioTxt = precio.trim().replace(',', '.');
    const precioNum = Number(precioTxt);
    const precioValido =
      precioTxt !== '' && !isNaN(precioNum) && precioNum > 0;
    if (!precioValido) {
      errores.push('Ingrese un precio unitario válido');
    }

    // 4. Si hay errores: mostrarlos y salir (el contador NO aumenta)
    if (errores.length > 0) {
      setMensaje({ tipo: 'error', texto: errores.join('\n') });
      setUltimoPedido(null);
      return;
    }

    // 5. Pedido válido: calcular total, guardar resumen y sumar 1 al contador
    const cant = Number(cantidadTxt);
    setUltimoPedido({
      cliente: cliente.trim(),
      producto: producto.trim(),
      cantidad: cant,
      precio: precioNum,
      total: cant * precioNum,
    });
    setMensaje({ tipo: 'ok', texto: 'Pedido registrado correctamente' });
    setContador(contador + 1);
  };

  // ---------- EVENTO: LIMPIAR ----------
  // Vacía campos y mensajes, pero NO toca el contador
  const limpiarFormulario = () => {
    setCliente('');
    setProducto('');
    setCantidad('');
    setPrecio('');
    setMensaje({ tipo: '', texto: '' });
    setUltimoPedido(null);
  };

  // ---------- INTERFAZ ----------
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      {/* RF-01: título y bienvenida */}
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>🌾 AgroMosquera</Text>
        <Text style={styles.bienvenida}>
          Bienvenido. Registre aquí los pedidos de sus clientes.
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Nombre del cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          value={cliente}
          onChangeText={setCliente}
        />

        <Text style={styles.etiqueta}>Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Bulto de papa"
          value={producto}
          onChangeText={setProducto}
        />

        <Text style={styles.etiqueta}>Cantidad (unidades)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 5"
          keyboardType="numeric"
          value={cantidad}
          onChangeText={setCantidad}
        />

        <Text style={styles.etiqueta}>Precio unitario ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3000"
          keyboardType="numeric"
          value={precio}
          onChangeText={setPrecio}
        />

        <View style={styles.botones}>
          <Button
            title="Registrar pedido"
            color="#2d6a4f"
            onPress={registrarPedido}
          />
          <View style={{ height: 10 }} />
          <Button title="Limpiar" color="#bc6c25" onPress={limpiarFormulario} />
        </View>
      </View>

      {/* Mensaje de error o éxito */}
      {mensaje.texto !== '' && (
        <View
          style={[
            styles.mensajeCaja,
            mensaje.tipo === 'error' ? styles.cajaError : styles.cajaOk,
          ]}
        >
          <Text
            style={mensaje.tipo === 'error' ? styles.textoError : styles.textoOk}
          >
            {mensaje.texto}
          </Text>

          {/* RF-07 y HU-09: resumen del pedido */}
          {ultimoPedido && (
            <View style={styles.resumen}>
              <Text style={styles.textoResumen}>
                Cliente: {ultimoPedido.cliente}
              </Text>
              <Text style={styles.textoResumen}>
                Producto: {ultimoPedido.producto}
              </Text>
              <Text style={styles.textoResumen}>
                Cantidad: {ultimoPedido.cantidad}
              </Text>
              <Text style={styles.textoResumen}>
                Precio unitario: {formatoPesos(ultimoPedido.precio)}
              </Text>
              <Text style={[styles.textoResumen, styles.total]}>
                Total: {formatoPesos(ultimoPedido.total)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* RF-08: totalizador */}
      <View style={styles.insignia}>
        <Text style={styles.insigniaNumero}>{contador}</Text>
        <Text style={styles.insigniaTexto}>pedidos válidos en la sesión</Text>
      </View>
    </ScrollView>
  );
}

// ---------- ESTILOS (StyleSheet) ----------
const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#fdf6e3',
    padding: 20,
    paddingTop: 50,
  },
  encabezado: {
    backgroundColor: '#2d6a4f',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  bienvenida: {
    fontSize: 15,
    color: '#d8f3dc',
    textAlign: 'center',
    marginTop: 6,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderTopWidth: 5,
    borderTopColor: '#bc6c25',
    elevation: 4,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d6a4f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#b7c9b0',
    backgroundColor: '#fafdf7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  botones: {
    marginTop: 22,
  },
  mensajeCaja: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
  },
  cajaError: { backgroundColor: '#fde8e8', borderLeftColor: '#c0392b' },
  cajaOk: { backgroundColor: '#e3f4e8', borderLeftColor: '#2d6a4f' },
  textoError: { color: '#c0392b', fontWeight: '600' },
  textoOk: { color: '#2d6a4f', fontWeight: 'bold', fontSize: 16 },
  resumen: { marginTop: 10 },
  textoResumen: { fontSize: 15, color: '#2b2b2b', marginBottom: 2 },
  total: { fontWeight: 'bold', fontSize: 18, marginTop: 6, color: '#bc6c25' },
  insignia: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#2d6a4f',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  insigniaNumero: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  insigniaTexto: { fontSize: 13, color: '#d8f3dc' },
});