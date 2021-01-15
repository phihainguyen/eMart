import React from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';

const AddressForm = () => {
	const methods = useForm();
	return (
		<div>
			<Typography>Shippding Address</Typography>
			<FormProvider>
				<form>
					<Grid />
				</form>
			</FormProvider>
		</div>
	);
};

export default AddressForm;
