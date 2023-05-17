const socket = io();

function sendProduct() {
	const product = {}
	
	product.title = document.getElementById('title').value;
	product.description = document.getElementById('description').value;
	product.category = document.getElementById('category').value;
	product.price = document.getElementById('price').value;
	product.thumbnail = document.getElementById('thumbnail').value;
	product.code = document.getElementById('code').value;
	product.stock = document.getElementById('stock').value;
	product.status = document.getElementById('status').value;
	// Envío el mensaje al servidor	
	socket.emit('new-product', product);
}

function deleteProduct() {
	const prodId = document.getElementById('id').value;
	// Envío el mensaje al servidor	
	socket.emit('delete-product', prodId);	
}

// socket.on('totalProducts', (data) => {
// 	const html = data
// 		.map((elem, index) => {
// 			return `<div>
// 				<h2>Producto </h2>
//                 <p>ID: ${elem.id}</p>
//                 <p>Título: ${elem.title}</p>
//                 <p>Descripción: ${elem.description}</p>
//                 <p>Categoría: ${elem.category}</p>
//                 <p>Precio: ${elem.price}</p>
//                 <p>Thumbnail: ${elem.thumbnail}</p>
//                 <p>Código: ${elem.code}</p>
//                 <p>Stock: ${elem.stock}</p>
//                 <p>Estado: ${elem.status}</p>
//             </div>`;
// 		})
//     document.getElementById('totalProducts').innerHTML = html;
// });
socket.on('totalProducts', (data) => {
	const html = data.map((elem, index) => {
	  return `<div class="product-container">
		<h2>Producto</h2>
		<p>ID: ${elem.id}</p>
		<p>Título: ${elem.title}</p>
		<p>Descripción: ${elem.description}</p>
		<p>Categoría: ${elem.category}</p>
		<p>Precio: ${elem.price}</p>
		<p>Thumbnail: ${elem.thumbnail}</p>
		<p>Código: ${elem.code}</p>
		<p>Stock: ${elem.stock}</p>
		<p>Estado: ${elem.status}</p>
	  </div>`;
	});
  
	document.getElementById('totalProducts').innerHTML = html.join('');
  });
  