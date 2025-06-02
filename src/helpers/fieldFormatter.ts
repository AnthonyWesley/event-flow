type NameFormat = "default" | "first" | "firstTwo";

export const fieldFormatter = {
  name(value: string, format: NameFormat = "default"): string {
    if (!value) return "";

    const capitalized = value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const parts = capitalized.trim().split(/\s+/);

    const formatters: Record<NameFormat, () => string> = {
      default: () => capitalized,
      first: () => parts[0] ?? "",
      firstTwo: () => parts.slice(0, 2).join(" "),
    };

    return formatters[format]();
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
