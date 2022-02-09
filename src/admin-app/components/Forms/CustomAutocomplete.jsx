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
		if ( Array.isArray( value ) ) {
			const selectedIds = value.length > 0 ? value.map( ( option ) => option.value ) : value.value;

			output = options.filter( ( option ) => selectedIds.includes( option.value ) );
		} else {
			output = options.find( ( option ) => option.value.toLowerCase() === value.value.toLowerCase() );
		}
		//v = options.filter( ( option ) => value.includes( option.value ) );
	} else {
		output = options.find( ( option ) => option.value.toLowerCase() === value.toLowerCase() );
	}

	return output;
};

export const CustomAutocomplete = ( props ) => {
	const { __ } = wp.i18n;
	const [ open, setOpen ] = useState( false );
	const [ endpoint, setEndpoint ] = useState( false );
	const [ searchText, setSearchText ] = useState( '' );

	const { values, errors, touched, setFieldValue } = useFormikContext();

	const [ field ] = useField( props );

	const customProps = { ...props };
	customProps.customProps && delete customProps.customProps;

	const [ postsOptions, setPostsOptions ] = useState( [] );
	//const [ loading, setLoading ] = useState( false );
	const loading = open && postsOptions.length === 0;

	const searchApi = async ( endpoint, searchText = '', values = [] ) => {
		if ( endpoint ) {
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
	};

	useEffect( () => {
		if ( options ) {
			setPostsOptions( options );
		} else {
			setPostsOptions( [] );
		}
	}, [ options ] );

	useEffect( () => {
		if ( ! open && endpoint !== false ) {
			setPostsOptions( [] );
		}
	}, [ open ] );

	useEffect( () => {
		if ( props.customProps && props.customProps.endpoint !== undefined ) {
			setEndpoint( props.customProps.endpoint );
		}
	}, [ props.customProps ] );

	useEffect( () => {
		let active = true;

		if ( ! loading ) {
			return undefined;
		}

		searchApi( endpoint, searchText, values );

		return () => {
			active = false;
		};
	}, [ loading ] );

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
				disableClearable={ disableClearable ?? true }
				autoComplete={ false }
				noOptionsText={ noOptionsText ?? __( 'No values', 'wp-posts-carousel' ) }
				value={
					endpoint !== false
						? values[ name ]
						: customAutocompleteDefaultValue( postsOptions, value )
				}
				isOptionEqualToValue={ ( option, value ) => option.value === value.value }
				onInputChange={ ( event, newValue ) => {
					setSearchText( newValue );
					if ( onInputChange && typeof onInputChange === 'function' ) {
						onInputChange( event, newValue );
					}
				} }
				onOpen={ () => {
					setOpen( true );

					if ( onOpen && typeof onOpen === 'function' ) {
						onOpen();
					}
				} }
				onClose={ () => {
					setOpen( false );
				} }
				onChange={ ( event, newValue ) => {
					setFieldValue( field.name, newValue );

					if ( onChange && typeof onChange === 'function' ) {
						onChange( event, newValue );
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
							),
						} }
		
						
					/>
				) }
			/>
		</>
	);
};
