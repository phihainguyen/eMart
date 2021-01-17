import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormInput';
import { commerce } from '../../lib/commerce';
const AddressForm = ({ checkoutToken }) => {
	const [ shippingCountries, setShippingCountries ] = useState([]);
	const [ shippingCountry, setShippingCountry ] = useState('');
	const [ shippingSubdivisions, setShippingSubdivisions ] = useState([ '' ]);
	const [ shippingSubdivision, setShippingSubdivision ] = useState('');
	const [ shippingOptions, setShippingOptions ] = useState([]);
	const [ shippingOption, setShippingOption ] = useState('');
	const methods = useForm();

	const countries = Object.entries(shippingCountries).map(([ code, name ]) => ({
		id    : code,
		label : name
	}));

	const subdivisions = Object.entries(shippingSubdivisions).map(([ code, name ]) => ({ id: code, label: name }));

	const options = shippingOptions.map((sOption) => ({
		id    : sOption.id,
		label : `${sOption.description} - (${sOption.price.formatted_with_symbol})`
	}));

	const fetchShippingCountries = async (checkoutTokenId) => {
		const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
		console.log(countries);
		setShippingCountries(countries);
		setShippingCountry(Object.keys(countries)[0]);
	};

	const fetchSubdivision = async (countryCode) => {
		const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

		setShippingSubdivisions(subdivisions);
		setShippingSubdivision(Object.keys(subdivisions)[0]);
	};

	const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
		const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

		setShippingOptions(options);
		setShippingOption(options[0].id);
	};

	useEffect(() => {
		fetchShippingCountries(checkoutToken.id);
	}, []);

	useEffect(
		() => {
			if (shippingCountry) {
				fetchSubdivision(shippingCountry);
				console.log('workng');
			}
		},
		[ shippingCountry ]
	);

	useEffect(
		() => {
			if (shippingSubdivision) {
				fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
			}
		},
		[ shippingSubdivision ]
	);

	return (
		<div>
			<Typography variant="h6" gutterBottom>
				Shipping Address
			</Typography>
			<FormProvider {...methods}>
				<form onSubmit="">
					<Grid container spacing={3}>
						<FormInput name="lastName" label="Last name" />
						<FormInput name="address1" label="Address" />
						<FormInput name="email" label="Email" />
						<FormInput name="City" label="City" />
						<FormInput name="zip" label="ZIP / Postal code" />
						<FormInput name="firstName" label="First name" />
						<Grid item xs={12} sm={6}>
							<InputLabel>
								Shipping Country
								<Select
									value={shippingCountry}
									fullWidth
									onChange={(e) => setShippingCountry(e.target.value)}
								>
									{countries.map((country) => (
										<MenuItem key={country.id} value={country.id}>
											{country.label}
										</MenuItem>
									))}
								</Select>
							</InputLabel>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>
								Shipping Subdivsion
								<Select
									value={shippingSubdivision}
									fullWidth
									onChange={(e) => setShippingSubdivision(e.target.value)}
								>
									{subdivisions.map((subdivision) => (
										<MenuItem key={subdivision.id} value={subdivision.id}>
											{subdivision.label}
										</MenuItem>
									))}
								</Select>
							</InputLabel>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>
								Shipping Options
								<Select
									value={shippingOption}
									fullWidth
									onChange={(e) => setShippingOption(e.target.value)}
								>
									{options.map((option) => (
										<MenuItem key={option.id} value={option.id}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</InputLabel>
						</Grid>
					</Grid>
				</form>
			</FormProvider>
		</div>
	);
};

export default AddressForm;
