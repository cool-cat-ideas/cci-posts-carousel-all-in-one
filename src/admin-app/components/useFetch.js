import { useEffect, useState } from 'react';

const useFetch = ( url, options ) => {
	const [ data, setData ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );
	useEffect( () => {
		const fetchData = async () => {
			setIsLoading( true );
			try {
				const res = await fetch( url, options );
				const json = await res.json();
				setData( json );
				setIsLoading( false );
			} catch ( error ) {
				setError( error );
			}
		};
		fetchData();
	}, [] );
	return { data, error, isLoading };
};
export default useFetch;
