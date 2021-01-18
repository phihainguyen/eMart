import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const PaymentForm = ({ checkoutToken, backStep, onCaptureCheckout, nextStep, timeout }) => {
	const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

	const handleSubmit = async (event, elements, stripe) => {
		event.preventDefaut();
		if (!stripe || !elements) return;
		const cardElement = elements.getElement(CardElement);
		const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

		if (error) {
			console.log(error);
		}
		else {
			const orderData = {
				line_items   : checkoutToken.live.line_items,
				customer     : {
					email     : shippingData.firstName,
					firstname : shippingData.lastName,
					lastName  : shippingData.lastName,
					email     : shippingData.email
				},
				shipping     : {
					name            : 'Primary',
					street          : shippingData.address1,
					town_city       : shippingData.city,
					county_state    : shippingData.shippingSubdivision,
					postal_zip_code : shippingData.zip,
					country         : shippingData.shippingCountry
				},
				fullfillment : { shipping_method: shippingData.shippingOtion },
				payment      : {
					Gateway : 'stripe',
					stripe  : {
						payment_method_id : paymentMethod.id
					}
				}
			};
			onCaptureCheckout(checkoutToken.id, orderData);
			timeout();
			nextStep();
		}
	};
	return (
		<div>
			<Review checkoutToken={checkoutToken} />
			<Divider />
			<Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>
				Payment method
			</Typography>
			<Elements stripe={stripePromise}>
				<ElementsConsumer>
					{({ elements, stripe }) => (
						<form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
							<CardElement />
							<br />
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Button variant="outlined" onClick={backStep}>
									Back
								</Button>
								<Button type="submit" variant="contained" disabled={!stripe} color="primary">
									Pay {checkoutToken.live.subtotal.formatted_with_symbol}
								</Button>
							</div>
						</form>
					)}
				</ElementsConsumer>
			</Elements>
		</div>
	);
};

export default PaymentForm;
