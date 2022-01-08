import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormikContext, useField } from 'formik';
import api from '../Api';

export const customAutocompleteDefaultValue = ( options, value ) => {
	let output = [];

	if ( ! options || options.length === 0 || ! value ) {
		return output;
	}

	if ( typeof value === 'object' ) {
		const selectedIds = value.map( ( option ) => option.value );

		output = options.filter( ( option ) => selectedIds.includes( option.value ) );
		//v = options.filter( ( option ) => value.includes( option.value ) );
	} else {
		output = options.find( ( option ) => option.value.toLowerCase() === value.toLowerCase() );
	}

	return output;
};

export const CustomAutocomplete = ( props ) => {
	const { __ } = wp.i18n;
	const { values, errors, touched, setFieldValue } = useFormikContext();

	const [ field ] = useField( props );

	const customProps = { ...props };
	customProps.customProps && delete customProps.customProps;

	const [ postsOptions, setPostsOptions ] = useState( [] );
	const [ loading, setLoading ] = useState( false );

	const searchApi = async ( endpoint, searchText = '', values = [] ) => {
		if ( endpoint ) {
			setLoading( true );
			await api
				.post( endpoint + searchText, values )
				.then( ( response ) => {
					if ( response.status == 200 && response.data ) {
						setPostsOptions( response.data ?? [] );
					}
				} )
				.catch( ( error ) => {
					props.customProps.store.enqueueSnackbar( {
						message: __( 'Failed get data from API', 'wp-posts-carousel' ),
						options: {
							variant: 'error',
						},
					} );
				} );
		}
		setLoading( false );
	};

	useEffect( () => {
		if ( options ) {
			setPostsOptions( options );
		} else {
			setPostsOptions( [] );
		}
	}, [ options ] );

	const {
		name,
		id,
		size,
		value,
		fullWidth,
		multiple,
		options,
		noOptionsText,
		onOpen,
		onInputChange,
		onChange,
		groupBy,
		disableClearable,
	} = props;

	return (
		<>
			<Autocomplete
				{ ...customProps }
				name={ name }
				options={ postsOptions }
				id={ id ?? name }
				size={ size ?? 'small' }
				fullWidth={ fullWidth ?? true }
				multiple={ multiple ?? false }
				disableClearable={disableClearable ?? true}
				openOnFocus={true}
				autoComplete={false}
				noOptionsText={ noOptionsText ?? __( 'No values', 'wp-posts-carousel' ) }
				value={ customAutocompleteDefaultValue( postsOptions, value ) }
				isOptionEqualToValue={ ( option, value ) => option.value === value.value }
				onInputChange={ ( event, newValue ) => {
					if ( onInputChange && typeof onInputChange === 'function' ) {
						onInputChange( event, newValue, options, searchApi );
					}
				} }
				onOpen={ () => {
					if ( onOpen && typeof onOpen === 'function' ) {
						onOpen( searchApi );
					}
				} }
				onChange={ ( event, newValue ) => {
					let newFormikValue = props.multiple ? [] : '';

					if ( props.multiple ) {
						newFormikValue = newValue;
						//newValue.map( ( value ) => newFormikValue.push( value.value ) );
					} else {
						newFormikValue = newValue;
						//newFormikValue = newValue.value;
					}

					if ( onChange && typeof props.onChange === 'function' ) {
						props.onChange( event, newFormikValue, options );
					} else {
						setFieldValue( field.name, newFormikValue );
					}
				} }
				getOptionLabel={ ( option ) => {
					return option.label ?? '';
				} }
				groupBy={ ( option ) => {
					if ( groupBy && typeof groupBy === 'function' ) {
						return groupBy( option );
					}
				} }
				filterSelectedOptions
				loading={ loading }
				renderInput={ ( params ) => (
					<TextField
						{ ...params }
						helperText={ touched[ name ] ? errors[ name ] : '' }
						error={ touched[ name ] && Boolean( errors[ name ] ) }
						variant="outlined"
						InputProps={ {
							...params.InputProps,
							endAdornment: (
								<>
									{ loading && <CircularProgress color="inherit" size={ 20 } /> }
									{ params.InputProps.endAdornment }
								</>
							)
						} }
						fullWidth
						required
					/>
				) }
			/>
		</>
	);
};
