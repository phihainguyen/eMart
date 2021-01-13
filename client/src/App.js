import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart } from './components';

const App = () => {
	const [ products, setProducts ] = useState([]);
	const [ cart, setCart ] = useState({});

	const fetchProducts = async () => {
		const { data } = await commerce.products.list();
		setProducts(data);
	};

	const fetchCart = async () => {
		// const cart = await commerce.cart.retrieve();
		setCart(await commerce.cart.retrieve());
	};

	const handleAddToCart = async (productID, quantity) => {
		const item = await commerce.cart.add(productID, quantity);
		setCart(item.cart);
	};

	useEffect(() => {
		fetchProducts();
		fetchCart();
	}, []);

	console.log(cart);
	return (
		<div>
			<Navbar totalItems={cart.total_items} />
			<Cart cart={cart} />
		</div>
	);
};
export default App;
