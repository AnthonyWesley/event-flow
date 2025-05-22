export const fieldFormatter = {
  name(value: string): string {
    return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  },

  phone(value: string): string {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)} ${digits.slice(7, 11)}`;
  },
};
