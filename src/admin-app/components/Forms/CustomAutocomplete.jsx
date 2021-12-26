import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormikContext, useField } from 'formik';
import api from '../Api';
import { getInputUtilityClass, getStepIconUtilityClass } from '@mui/material';

export const customAutocompleteDefaultValue = ( options, value ) => {
	if ( ! options || ! value ) {
		return '';
	}
	let v = [];
	if ( typeof value === 'object' ) {
		v = options.filter( ( option ) => value.includes( option.value ) );
	} else {
		v = options.find( ( option ) => option.value.toLowerCase() === value.toLowerCase() );
	}

	return v;
};

export const CustomAutocomplete = ( props ) => {
	//const options = [ 'Option 1', 'Option 2' ];

	const { __ } = wp.i18n;
	// const [ open, setOpen ] = useState( false );

	// const [inputValue, setInputValue] = useState('');

	// const [ init, setInit ] = useState( false );
	// const [ options, setOptions ] = useState( [] );
	// const [ search, setSearch ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	// const [ endpoint, setEndpoint ] = useState();

	const { values, errors, touched, setFieldValue } = useFormikContext();

	const [ field ] = useField( props );
	// const [ value, setValue ] = useState( props.multiple ? [] : '' );
	// const { classes } = props;

	// const searchPosts = async () => {
	// 	if ( endpoint ) {
	// 		await api
	// 			.post( endpoint + search, values )
	// 			.then( ( response ) => {
	// 				if ( response.status == 200 && response.data ) {
	// 					let data = response.data;

	// 					if ( typeof props.customProps.renderOptions === 'function' ) {
	// 						data = data.map( props.customProps.renderOptions );
	// 					}

	// 					setOptions( data );
	// 				}
	// 			} )
	// 			.catch( ( error ) => {
	// 				props.store.enqueueSnackbar( {
	// 					message: __( 'Failed get data from API', 'wp-posts-carousel' ),
	// 					options: {
	// 						variant: 'error',
	// 					},
	// 				} );
	// 			} );
	// 	}
	// 	setLoading( false );
	// };

	// useEffect( () => {
	// 	let active = true;
	// 	setLoading( true );

	// 	if ( endpoint && open === true ) {
	// 		( async () => {
	// 			await api
	// 				.post( endpoint + search, values )
	// 				.then( ( response ) => {
	// 					if ( response.status == 200 && response.data ) {
	// 						let data = response.data;

	// 						if ( typeof props.customProps.renderOptions === 'function' ) {
	// 							data = data.map( props.customProps.renderOptions );
	// 						}

	// 						setOptions( data );
	// 					}
	// 				} )
	// 				.catch( ( error ) => {
	// 					// props.store.enqueueSnackbar( {
	// 					// 	message: __( 'Failed get data from API', 'wp-posts-carousel' ),
	// 					// 	options: {
	// 					// 		variant: 'error',
	// 					// 	},
	// 					// } );
	// 				} );

	// 			//setSearch( '' );
	// 			setLoading( false );
	// 		} )();
	// 	} else {
	// 		//setSearch( '' );
	// 		//setOpen( false );
	// 		setLoading( false );
	// 	}

	// 	return () => {
	// 		active = false;
	// 	};
	// }, [  open, search ] );

	// useEffect( () => {
	// 	if (
	// 		props.customProps &&
	// 		props.customProps.setSearchEndpoint &&
	// 		endpoint != props.customProps.setSearchEndpoint
	// 	) {
	// 		setEndpoint( props.customProps.setSearchEndpoint );
	// 	}
	// }, [ props.customProps ] );

	// useEffect( () => {
	// 	//if ( props.options  ) {
	// 	//	console.log('props.options')
	// 	//	console.log(props.options)
	// 	setOptions( props.options );
	// 	//setValue( defaultValue( props.options, values[ field.name ] || [] ) );
	// 	//} else {
	// //	setOptions( [] );
	// 	// //console.log('value')
	// 	// //console.log(values[ field.name ])
	// 	// if(values[ field.name ])
	// 	//	 setValue( values[ field.name ]);
	// 	// else
	// 	// setValue( props.multiple ? [{'value':'1','label':'dupa'}] : '');
	// 	//}
	// }, [ props.options ] );

	// useEffect( () => {
	// 	let v = props.multiple ? [] : ''
	// 	if(values[ field.name ] && !value) {
	// 		v = values[ field.name ]
	// 		console.log("jj")
	// 		setValue( defaultValue( props.options, v ) );
	// 	}

	// }, [ value ] );

	useEffect( () => {
		// console.log(props)
		setLoading( props.loading );
	}, [ props ] );

	const childProps = { ...props };
	childProps.customProps && delete childProps.customProps;

	return (
		<>
			<Autocomplete
				{ ...childProps }
				// options={ options }
				id={ props.id ?? field.name }
				size={ props.size ?? 'small' }
				fullWidth={ props.fullWidth ?? true }
				noOptionsText={ props.noOptionsText ?? __( 'No values', 'wp-posts-carousel' ) }
				value={ props.value || customAutocompleteDefaultValue( props.options, values[ field.name ] ) }
				isOptionEqualToValue={ ( option, value ) => option.value === value.value }
				// onOpen={ () => {
				// 	searchPosts();
				// } }
				// onInputChange={ ( event, newValue ) => {
				// 	setSearch( newValue );
				// 	searchPosts( newValue );
				// } }
				onChange={ ( event, newValue ) => {
					//setValue( newValue );

					let newFormikValue = props.multiple ? [] : '';
					//console.log(newValue)
					if ( props.multiple ) {
						newValue.map( ( value ) => newFormikValue.push( value.value ) );
					} else {
						newFormikValue = newValue.value;
					}

					if ( typeof props.onChange === 'function' ) {
						props.onChange( event, newFormikValue );
					} else {
						setFieldValue( field.name, newFormikValue );
					}
				} }
				// getOptionLabel={(option) => {
				// 	console.log(option)
				// 	return option
				// }}
				filterSelectedOptions
				// filterOptions={ createFilterOptions( {
				// 	matchFrom: 'start',
				// 	stringify: ( option ) => option.value,
				// } ) }
				// className={ clsx( classes.margin, classes.textField ) }
				// loading={ loading }
				renderInput={ ( params ) => (
					<TextField
						{ ...params }
						helperText={ touched[ name ] ? errors[ name ] : '' }
						error={ touched[ name ] && Boolean( errors[ name ] ) }
						label=""
						variant="outlined"
						InputProps={ {
							...params.InputProps,
							endAdornment: (
								<>
									{ loading && <CircularProgress color="inherit" size={ 20 } /> }
									{ params.InputProps.endAdornment }
								</>
							),
							//  autoComplete: false,
						} }
						fullWidth
						required
					/>
				) }
			/>
		</>
	);
};

/*
			<Autocomplete
				id={ props.id }
				multiple={ props.multiple ?? false }
				size={ props.size ?? 'small' }
				fullWidth={ props.fullWidth ?? true }
				value={ defaultValue( props.options, values[ field.name ] ) }
				noOptionsText={ props.noOptionsText ?? __( 'No values', 'wp-posts-carousel' ) }
				onOpen={ () => {
					setOpen( true );
				} }
				onInputChange={ ( event, newValue ) => {
					setSearch( newValue );
				} }
				onChange={ ( e, options ) => {
				//	let newValue = props.multiple ? [] : '';

					if ( props.multiple && typeof options === 'object' ) {
						options.map( ( value ) => newValue.push( value.value ) );
					} else {
						newValue = options.value;
					}

					console.log
					setNewValue(newValue)
					setFieldValue( field.name, newValue );
				} }
				onClose={ () => {
					setOpen( false );
				} }
				options={ options }
				getOptionSelected={ ( option, value ) => {
					return option.value === value.value;
				} }
				getOptionLabel={ ( option ) => {
					if ( option.label ) {
						return option.label;
					} else if ( options ) {
						const elem = options.find( ( item ) => item.value === option );

						if ( elem && elem.label ) {
							return elem.label;
						} else {
							return '';
						}
					}
					return '';
				} }
				filterSelectedOptions
				filterOptions={ createFilterOptions( {
					matchFrom: 'start',
					stringify: ( option ) => option.value,
				} ) }
				className={ clsx( classes.margin, classes.textField ) }
				loading={ loading }
				renderInput={ ( params ) => (
					<TextField
						{ ...params }
						helperText={ touched[ name ] ? errors[ name ] : '' }
						error={ touched[ name ] && Boolean( errors[ name ] ) }
						label=""
						variant="outlined"
						InputProps={ {
							...params.InputProps,
							endAdornment: (
								<>
									{ loading && <CircularProgress color="inherit" size={ 20 } /> }
									{ params.InputProps.endAdornment }
								</>
							),
							autoComplete: name,
						} }
						fullWidth
						required
					/>
				) }
			/>*/
