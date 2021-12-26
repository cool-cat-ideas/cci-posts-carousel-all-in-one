import Yup from './../../../../components/Yup';

import { CarouselSchema } from './CarouselSchema';

export const EditCarouselSchema = CarouselSchema.shape( {
	id: Yup.string().required(),
} );
