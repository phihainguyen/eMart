import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import useStyles from './styles';
import logo from '../../assets/79628-200.png';

const Navbar = () => {
	const classes = useStyles();
	return (
		<AppBar position="fixed" className={classes.appBar} color="inherit">
			<Toolbar>
				<Typography variant="h6" className={classes.title} color="inherit">
					<img src={logo} alt="eMart.js" height="25px" className={classes.image} />
					eMart.js
				</Typography>
				<div className={classes.grow} />
				<div className={classes.button}>
					<IconButton aria-label="Show cart items" color="inherit">
						<Badge badgeContent={2} color="secondary">
							<ShoppingCart />
						</Badge>
					</IconButton>
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
