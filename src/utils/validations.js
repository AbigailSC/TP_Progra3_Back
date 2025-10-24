
const Validator = {
  length: (min, max = Infinity) => {
    return (value) => {
      if (typeof value !== 'string') return false;
      const length = value.length;
      return length >= min && length <= max;
    }
  },
  min: (minValue) => {
    return (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      return value >= minValue;
    };
  },
  max: (maxValue) => {
    return (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      return value <= maxValue;
    }
  },
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  strongPassword: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  notEmpty: (value) => {
    return value !== null && value !== undefined && value !== '';
  },
  isString: (value) => {
    return typeof value === 'string';
  },
  isInt: (value) => {
    return Number.isInteger(value);
  },
  isFloat: (value) => {
    return typeof value === 'number' && !Number.isNaN(value);
  },
  isUrl: (value) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  },
  isBoolean: (value) => {
    return typeof value === 'boolean';
  },
  isPositive: (value) => {
    return value > 0;
  }
}

export const validateCreateProducto = ({ titulo, precio, stock, sku, cliente_nombre }) => {
  const errors = [];

  if (!Validator.notEmpty(titulo)) {
    errors.push('El titulo es obligatorio');
  } else if (!Validator.isString(titulo)) {
    errors.push('El titulo debe ser un texto');
  } else if (!Validator.length(3, 100)(titulo)) {
    errors.push('El titulo debe tener entre 3 y 100 caracteres');
  }

  if (!Validator.notEmpty(precio)) {
    errors.push('El precio es obligatorio');
  } else if (!Validator.isFloat(precio)) {
    errors.push('El precio debe ser un número');
  } else if (!Validator.isPositive(precio)) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!Validator.notEmpty(stock)) {
    errors.push('El stock es obligatorio');
  } else if (!Validator.isInt(stock)) {
    errors.push('El stock debe ser un número entero');
  } else if (!Validator.isPositive(stock)) {
    errors.push('El stock no puede ser negativo');
  }

  if (!Validator.notEmpty(sku)) {
    errors.push('El SKU es obligatorio');
  } else if (!Validator.isString(sku)) {
    errors.push('El SKU debe ser un texto');
  } else if (!Validator.length(3, 32)(sku)) {
    errors.push('El SKU debe tener entre 3 y 32 caracteres');
  }

  if (cliente_nombre !== undefined) {
    if (!Validator.isString(cliente_nombre)) {
      errors.push('El nombre del cliente debe ser un texto');
    } else if (!Validator.length(3, 64)(cliente_nombre)) {
      errors.push('El nombre del cliente debe tener entre 3 y 64 caracteres');
    }
  }

  return errors;
}

export const validateLogin = ({ email, password }) => {
  const errors = [];
  if (!Validator.notEmpty(email)) {
    errors.push('El correo electrónico es obligatorio');
  } else if (!Validator.email(email)) {
    errors.push('El correo electrónico no es válido');
  }
  if (!Validator.notEmpty(password)) {
    errors.push('La contraseña es obligatoria');
  } else if (!Validator.strongPassword(password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial');
  }
  return errors;
}

export const validateRegister = ({ nombre, email, password }) => {
  const errors = [];
  if (!Validator.notEmpty(nombre)) {
    errors.push('El nombre es obligatorio');
  } else if (!Validator.isString(nombre)) {
    errors.push('El nombre debe ser un texto');
  } else if (!Validator.length(3, 64)(nombre)) {
    errors.push('El nombre debe tener entre 3 y 64 caracteres');
  }
  if (!Validator.notEmpty(email)) {
    errors.push('El correo electrónico es obligatorio');
  } else if (!Validator.email(email)) {
    errors.push('El correo electrónico no es válido');
  }
  if (!Validator.notEmpty(password)) {
    errors.push('La contraseña es obligatoria');
  } else if (!Validator.strongPassword(password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial');
  }
  return errors;
}