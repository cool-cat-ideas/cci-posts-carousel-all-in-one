import * as Yup from 'yup';

export const CreateCarouselSchema = Yup.object().shape( {
	title: Yup.string().required( 'Required' ),
	ordering: Yup.string().required( 'Required' ),
	firstName: Yup.string().required( 'Required' ),
	lastName: Yup.string().required( 'Required' ),
	email: Yup.string()
		.email( 'Enter a valid email' )
		.required( 'Email is required' ),
	course: Yup.string().required( 'Select your course category' ),
	password: Yup.string()
		.min( 8, 'Password must contain at least 8 characters' )
		.required( 'Enter your password' ),
	confirmPassword: Yup.string()
		.required( 'Confirm your password' )
		.oneOf( [ Yup.ref( 'password' ) ], 'Password does not match' ),
} );
