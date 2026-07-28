export type BookingData = {
  name: string;
  phone: string;
  date: string;
  time: string;
  zone: string;
  pcs: string;
  comment: string;
};

export type BookingErrors = Partial<Record<keyof BookingData, string>>;

const requiredFields: Array<[keyof BookingData, string]> = [
  ["name", "Укажите имя"],
  ["phone", "Укажите телефон"],
  ["date", "Выберите дату"],
  ["time", "Выберите время"],
  ["zone", "Выберите зону"],
];

export function validateBooking(data: BookingData): BookingErrors {
  return Object.fromEntries(
    requiredFields
      .filter(([field]) => !data[field].trim())
      .map(([field, message]) => [field, message]),
  );
}
