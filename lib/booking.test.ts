import assert from "node:assert/strict";
import test from "node:test";

import { validateBooking } from "./booking.ts";

test("requires core booking fields", () => {
  assert.deepEqual(
    validateBooking({
      name: "",
      phone: "",
      date: "",
      time: "",
      zone: "",
      pcs: "1",
      comment: "",
    }),
    {
      name: "Укажите имя",
      phone: "Укажите телефон",
      date: "Выберите дату",
      time: "Выберите время",
      zone: "Выберите зону",
    },
  );
});

test("accepts a complete booking", () => {
  assert.deepEqual(
    validateBooking({
      name: "Артём",
      phone: "+7 917 000-00-00",
      date: "2026-08-01",
      time: "18:00",
      zone: "Pro Zone",
      pcs: "2",
      comment: "",
    }),
    {},
  );
});
