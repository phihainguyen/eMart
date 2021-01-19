import React, { useState, useEffect } from 'react';

import {
	Paper,
	Stepper,
	Step,
	StepLabel,
	Typography,
	CircularProgress,
	Divider,
	Button,
	CssBaseline
} from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { Link, useHistory } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';

const steps = [ 'Shipping address', 'Payment details' ];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
	const [ activeStep, setActiveStep ] = useState(0);
	const [ checkoutToken, setCheckoutToken ] = useState(null);
	const [ shippingData, setShippingData ] = useState({});
	const [ isFinished, setIsFinished ] = useState(false);
	const classes = useStyles();
	const history = useHistory();

	useEffect(
		() => {
			const generateToken = async () => {
				try {
					const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

					setCheckoutToken(token);
				} catch (error) {
					console.log(error.message);
					if (activeStep !== steps.length) history.push('/');
				}
			};

			generateToken();
		},
		[ cart ]
	);
	const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
	const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

	const next = (data) => {
		setShippingData(data);
		nextStep();
	};

	const timeout = () => {
		setTimeout(() => {
			setIsFinished(true);
		}, 3000);
	};
	const test = (data) => {
		setShippingData(data);
		timeout();
		nextStep();
	};

	let Confirmation = () =>
		order.customer ? (
			<div>
				<div>
					<h1>Thank you for your purchase!</h1>
				</div>
				<br />
				<Button component={Link} to="/" variant="outlined" type="button">
					Back to Home
				</Button>
			</div>
		) : isFinished ? (
			<div>
				<Typography variant="h5">Thank you for your purchase!</Typography>
				<br />
				<Button component={Link} variant="outlined" type="button" to="/">
					Back to home
				</Button>
			</div>
		) : (
			<div className={classes.spinner}>
				<CircularProgress />
			</div>
		);

	if (error) {
		Confirmation = () => (
			<div>
				<Typography variant="h5">Thank you for your purchase!</Typography>
				<br />
				<Button component={Link} variant="outlined" type="button" to="/">
					Back to home
				</Button>
			</div>
		);
	}
	const Form = () =>
		activeStep === 0 ? (
			<AddressForm
				checkoutToken={checkoutToken}
				nextStep={nextStep}
				setShippingData={setShippingData}
				test={test}
			/>
		) : (
			<PaymentForm
				checkoutToken={checkoutToken}
				nextStep={nextStep}
				backStep={backStep}
				shippingData={shippingData}
				onCaptureCheckout={onCaptureCheckout}
				timeout={timeout}
			/>
		);
	return (
		<div>
			<CssBaseline />
			<div className={classes.toolbar} />
			<main className={classes.layout}>
				<Paper className={classes.paper}>
					<Typography variant="h4" align="center">
						Checkout
					</Typography>
					<Stepper activeStep={activeStep} className={classes.stepper}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					{activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
				</Paper>
			</main>
		</div>
	);
};
export default Checkout;
