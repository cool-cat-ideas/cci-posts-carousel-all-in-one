import * as Yup from 'yup';

const { __ } = wp.i18n;

Yup.setLocale({
  mixed: {
    default: __( 'Niewłaściwa wartość ', 'wp-posts-carousel' ),
    required: __( 'To pole jest wymagane', 'wp-posts-carousel' ),
    oneOf: __( 'Pole musi mieć jedną z wartości: ${values}', 'wp-posts-carousel' ),
    notOneOf: __( 'Pole nie może przyjmować wartości: ${values}', 'wp-posts-carousel' ),
    notType: __( 'Niewłaściwa wartość pola', 'wp-posts-carousel' ),
    /*notType: ({ path, type, value, originalValue }) => {
      let msg =`Pole musi być typu \`${type}\`` ;
      return msg;
    },*/
  },
  string : {
    length: __( 'Pole musi mieć długość ${length}', 'wp-posts-carousel' ),
    min: __( 'Pole musi mieć przynajmniej ${min} znaków', 'wp-posts-carousel' ),
    max: __( 'Pole może przyjąć maksymalnie ${max} znaków', 'wp-posts-carousel' ),
    matches: __( 'Pole mus spełniać regułę: "${regex}"', 'wp-posts-carousel' ),
    email: __( 'Pole musi być poprawnym adresem email', 'wp-posts-carousel' ),
    url: __( 'Pole musi być poprawnym adresem URL', 'wp-posts-carousel' ),
    trim: __( 'Pole musi być łańcuchem znaków', 'wp-posts-carousel' ),
    lowercase: __( 'Dozwolone są tylko małe znaki', 'wp-posts-carousel' ),
    uppercase: __( 'Dozwolone są tylko duże znaki', 'wp-posts-carousel' ),
  },
  number : {
    min: __( 'Wartość musi być większa lub równa ${min}', 'wp-posts-carousel' ),
    max: __( 'Wartość musi być mniejsza lub równa ${max}', 'wp-posts-carousel' ),
    lessThan: __( 'Wartość musi być mniejsza od ${less}', 'wp-posts-carousel' ),
    moreThan: __( 'Wartość musi być większa od ${more}', 'wp-posts-carousel' ),
    notEqual: __( 'Nie może być równe ${notEqual}', 'wp-posts-carousel' ),
    positive: __( 'Wartość musi być liczbą dodatnią', 'wp-posts-carousel' ),
    negative: __( 'Wartość musi być liczbą ujemną', 'wp-posts-carousel' ),
    integer: __( 'Wartość musi być liczbą całkowitą', 'wp-posts-carousel' ),
  },
  date : {
    min: __( 'Musi być datą więszą niż ${min}', 'wp-posts-carousel' ),
    max: __( 'Musi być datą mniejszą niż ${max}', 'wp-posts-carousel' ),
  } ,
  array : {
    min: __( 'Musi posiadać przynajmniej ${min} elementów', 'wp-posts-carousel' ),
    max: __( 'Musi posiadać co najwyżej ${max} elementów', 'wp-posts-carousel' ),
  } 
});

export default Yup