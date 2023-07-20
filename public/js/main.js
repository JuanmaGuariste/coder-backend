const socket = io();

async function createCart() {
	return await fetch('http://localhost:8080/api/carts',
		{
			method: 'POST'
		})
		.then(response => response.json())
		.then(cart => {
			return cart.payload._id;
		})
		.catch(error => {
			console.error('Error al crear el carrito:', error);
		});
}

async function addProductToCart(pid, cid) {
	const response = await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`, {
		method: 'POST'
	});

	if (response.ok) {
		Swal.fire({
			title: 'Producto agregado',
			icon: 'success'
		});
	} else {
		Swal.fire({
			title: 'Error al agregar el producto',
			text: 'Hubo un problema al agregar el producto al carrito',
			icon: 'error'
		});
	}
}

async function deleteProductFromCart(pid, cid) {
	const response = await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`, {
		method: 'DELETE'
	});

	if (response.ok) {
		Swal.fire({
			title: 'Producto quitado del carrito',
			icon: 'warning'
		})
			.then(() => {
				window.location.reload();
			})
	} else {
		Swal.fire({
			title: 'Error al quitar el producto del carrito',
			text: 'Hubo un problema al quitar el producto del carrito',
			icon: 'error'
		});
	}
}

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
	socket.emit('new-product', product);
}

function deleteProduct() {
	const prodId = document.getElementById('id').value;
	socket.emit('delete-product', prodId);
}

socket.on('totalProducts', (data) => {
	const html = data.map((elem, index) => {
		return `<div class="product-container">
		<h2>Producto</h2>
		<p>ID: ${elem._id}</p>
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