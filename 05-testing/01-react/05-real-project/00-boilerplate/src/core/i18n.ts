import { Validators } from '@lemoncode/fonk';
import { matchField } from '@lemoncode/fonk-match-field-validator';

export const setValidatorsMessagesToSpanish = () => {
  Validators.required.setErrorMessage('Debe informar el campo');
  Validators.email.setErrorMessage(
    'La dirección de correo no está bien formada'
  );
  matchField.setErrorMessage('El campo debe coincidir con {{field}}');
};

export const literals = {
  global: {
    copyrightFooter: 'Todos los derechos reservados',
    lemoncode: 'Lemoncode',
    welcome: 'Hola',
  },
  messages: {
    errors: {
      invalidLogin: 'Usuario y/o password no válidos',
    },
  },
  components: {
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
    },
    fields: {
      user: 'Usuario',
      password: 'Contraseña',
      myProfile: 'Mi Perfil',
    },
    date: {
      today: 'Hoy',
    },
  },
} as const;
