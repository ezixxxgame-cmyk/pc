"use client";

import Image from "next/image";
import {
  type FormEvent,
  type WheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type BookingData,
  type BookingErrors,
  validateBooking,
} from "@/lib/booking";

const tariffs = [
  {
    name: "Стандарт",
    price: "180",
    specs: "RTX 4060 · Ryzen 5 · 16 GB · 240 Гц",
    detail: "Механическая клавиатура, лёгкая игровая мышь, гарнитура 7.1",
  },
  {
    name: "Pro Zone",
    price: "250",
    specs: "RTX 4070 Super · Ryzen 7 · 32 GB · 360 Гц",
    detail: "Профессиональная периферия и увеличенное игровое место",
    featured: true,
  },
  {
    name: "Bootcamp",
    price: "320",
    specs: "RTX 4080 Super · Ryzen 7 · 32 GB · 360 Гц",
    detail: "Закрытая командная зона и премиальная периферия",
  },
];

const zones = [
  {
    number: "01",
    name: "Стандарт",
    description: "Стабильный FPS для рейтинга, кооператива и ночных каток.",
    specs: ["RTX 4060", "Ryzen 5", "16 GB RAM", "240 Hz"],
  },
  {
    number: "02",
    name: "Pro Zone",
    description: "Больше мощности, пространства и частоты для точной игры.",
    specs: ["RTX 4070 Super", "Ryzen 7", "32 GB RAM", "360 Hz"],
  },
  {
    number: "03",
    name: "Bootcamp",
    description: "Изолированная зона для командных тренировок и турниров.",
    specs: [
      "RTX 4080 Super",
      "Ryzen 7",
      "32 GB RAM",
      "360 Hz",
      "Премиальная периферия",
    ],
  },
];

const gallery = [
  {
    src: "/images/main-hall.webp",
    alt: "Основной игровой зал ProGaming с рядами компьютеров и фиолетовой подсветкой",
    label: "Основной зал",
  },
  {
    src: "/images/bootcamp.webp",
    alt: "Закрытая командная Bootcamp-зона с пятью игровыми местами",
    label: "Bootcamp",
  },
  {
    src: "/images/lounge.webp",
    alt: "Тёмная лаунж-зона клуба с мягкими креслами и видом на игровой зал",
    label: "Лаунж",
  },
  {
    src: "/images/pro-zone.webp",
    alt: "Компьютерные места Pro Zone с профессиональной периферией",
    label: "Pro Zone",
  },
];

const reviews = [
  {
    name: "Артём",
    meta: "17 лет",
    text: "Наконец-то 240 Гц без просадок. После школы играем здесь почти каждую пятницу.",
  },
  {
    name: "Даша",
    meta: "16 лет",
    text: "Чисто, спокойно и админы помогают. С подругами быстро разобрались с бронью.",
  },
  {
    name: "Тимур",
    meta: "19 лет",
    text: "Pro Zone реально ощущается быстрее. Периферия свежая, кресла удобные.",
  },
  {
    name: "Команда Pixel",
    meta: "5 игроков",
    text: "Bootcamp отлично подходит для тренировок: никто не отвлекает, связь стабильная.",
  },
];

const emptyBooking: BookingData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  zone: "",
  pcs: "1",
  comment: "",
};

function GlitchHeading({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: string;
}) {
  return (
    <div className="reveal">
      {eyebrow && <p className="section-kicker">{eyebrow}</p>}
      <h2 className="glitch-title" data-text={children}>
        {children}
      </h2>
    </div>
  );
}

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [booking, setBooking] = useState<BookingData>(emptyBooking);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const monitorScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setBooting(false), reduced ? 0 : 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    if (!cursor || !ring || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      const x = `${event.clientX}px`;
      const y = `${event.clientY}px`;
      cursor.style.translate = `${x} ${y}`;
      ring.animate({ translate: `${x} ${y}` }, { duration: 180, fill: "forwards" });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  function selectTariff(name: string) {
    setBooking((current) => ({ ...current, zone: name }));
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBooking(booking);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  }

  function keepWheelInside(event: WheelEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const canMoveDown =
      event.deltaY > 0 && target.scrollTop + target.clientHeight < target.scrollHeight - 1;
    const canMoveUp = event.deltaY < 0 && target.scrollTop > 0;
    if (canMoveDown || canMoveUp) event.stopPropagation();
  }

  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="ProGaming — наверх">
          <span>PRO</span>GAMING
        </a>
        <nav aria-label="Главная навигация">
          <a href="#about">О клубе</a>
          <a href="#zones">Зоны</a>
          <a href="#discount">Скидка</a>
          <a href="#reviews">Отзывы</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="Интерактивное бронирование">
          <div className="hero-glow" aria-hidden="true" />
          <p className="hero-caption">Компьютерный клуб · Уфа · 24/7</p>

          <div className="monitor-wrap">
            <div className="monitor">
              <div className="monitor-camera" aria-hidden="true" />
              <div
                ref={monitorScrollRef}
                className="monitor-screen"
                onWheel={keepWheelInside}
                tabIndex={0}
                aria-label="Тарифы и форма бронирования ProGaming"
              >
                <div className={`boot-screen ${booting ? "" : "boot-complete"}`}>
                  <span className="boot-line" />
                </div>

                <div className={`monitor-content ${booting ? "" : "is-ready"}`}>
                  <div className="screen-status">
                    <span className="live-dot" />
                    Система доступна
                    <span>PG—01</span>
                  </div>

                  <div className="screen-intro">
                    <p>PROGAMING / BOOKING</p>
                    <h1>Этот экран работает.</h1>
                    <span>Выбирай тариф и бронируй место</span>
                    <div className="scroll-hint" aria-hidden="true">
                      <i />
                      Листай внутри
                    </div>
                  </div>

                  <section className="tariffs" aria-labelledby="tariffs-title">
                    <div className="screen-section-head">
                      <span>01</span>
                      <h2 id="tariffs-title">Тарифы</h2>
                    </div>
                    <div className="tariff-grid">
                      {tariffs.map((tariff) => (
                        <article
                          className={`tariff-card ${tariff.featured ? "featured" : ""}`}
                          key={tariff.name}
                        >
                          {tariff.featured && <span className="tariff-mark">Выбор игроков</span>}
                          <h3>{tariff.name}</h3>
                          <p className="tariff-price">
                            {tariff.price} <span>₽ / час</span>
                          </p>
                          <p className="tariff-specs">{tariff.specs}</p>
                          <p className="tariff-detail">{tariff.detail}</p>
                          <button type="button" onClick={() => selectTariff(tariff.name)}>
                            Выбрать
                            <span aria-hidden="true">↗</span>
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section ref={formRef} className="booking-panel" aria-labelledby="booking-title">
                    <div className="screen-section-head">
                      <span>02</span>
                      <h2 id="booking-title">Бронирование</h2>
                    </div>
                    <form onSubmit={submitBooking} noValidate>
                      <div className="form-grid">
                        {[
                          ["name", "Имя", "text", "Как к вам обращаться"],
                          ["phone", "Телефон", "tel", "+7 (___) ___-__-__"],
                          ["date", "Дата", "date", ""],
                          ["time", "Время", "time", ""],
                        ].map(([name, label, type, placeholder]) => (
                          <label key={name}>
                            <span>{label} *</span>
                            <input
                              type={type}
                              name={name}
                              value={booking[name as keyof BookingData]}
                              placeholder={placeholder}
                              aria-invalid={Boolean(errors[name as keyof BookingErrors])}
                              aria-describedby={errors[name as keyof BookingErrors] ? `${name}-error` : undefined}
                              onChange={(event) => {
                                setBooking((current) => ({
                                  ...current,
                                  [name]: event.target.value,
                                }));
                                setErrors((current) => ({ ...current, [name]: undefined }));
                              }}
                            />
                            {errors[name as keyof BookingErrors] && (
                              <small id={`${name}-error`}>{errors[name as keyof BookingErrors]}</small>
                            )}
                          </label>
                        ))}

                        <label>
                          <span>Зона *</span>
                          <select
                            value={booking.zone}
                            aria-invalid={Boolean(errors.zone)}
                            aria-describedby={errors.zone ? "zone-error" : undefined}
                            onChange={(event) => {
                              setBooking((current) => ({ ...current, zone: event.target.value }));
                              setErrors((current) => ({ ...current, zone: undefined }));
                            }}
                          >
                            <option value="">Выберите зону</option>
                            {tariffs.map((tariff) => (
                              <option key={tariff.name}>{tariff.name}</option>
                            ))}
                          </select>
                          {errors.zone && <small id="zone-error">{errors.zone}</small>}
                        </label>

                        <label>
                          <span>Количество ПК</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={booking.pcs}
                            onChange={(event) =>
                              setBooking((current) => ({ ...current, pcs: event.target.value }))
                            }
                          />
                        </label>

                        <label className="form-full">
                          <span>Комментарий</span>
                          <textarea
                            rows={3}
                            value={booking.comment}
                            placeholder="Пожелания по местам или оборудованию"
                            onChange={(event) =>
                              setBooking((current) => ({
                                ...current,
                                comment: event.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                      <div className="form-submit">
                        <p>Оплата в клубе: картой или наличными</p>
                        <button type="submit">Оставить заявку</button>
                      </div>
                    </form>
                  </section>
                </div>
              </div>
            </div>
            <div className="monitor-neck" aria-hidden="true" />
            <div className="monitor-base" aria-hidden="true" />
          </div>
        </section>

        <section id="discount" className="discount-section page-section">
          <div className="discount-card reveal">
            <div>
              <p className="section-kicker">Первый визит</p>
              <h2 className="glitch-title" data-text="-30% на первый час игры">
                -30% на первый час игры
              </h2>
            </div>
            <p>
              Один раз для нового гостя при бронировании от двух часов.
              Покажи администратору заявку на входе.
            </p>
          </div>
        </section>

        <section id="about" className="about-section page-section">
          <div>
            <GlitchHeading eyebrow="О клубе" children="ProGaming — твоя игровая зона" />
          </div>
          <div className="about-copy reveal">
            <p>
              Место, где железо не мешает выигрывать. Мы собрали быстрые
              станции, понятный сервис и атмосферу, в которой одинаково
              комфортно зайти на час или тренироваться всей командой.
            </p>
            <div className="about-stats">
              <span><b>42</b> игровых места</span>
              <span><b>1 Гбит/с</b> стабильная сеть</span>
              <span><b>24/7</b> без выходных</span>
            </div>
          </div>
        </section>

        <section id="zones" className="zones-section page-section">
          <GlitchHeading eyebrow="Зоны и железо" children="Твой уровень мощности" />
          <div className="zones-list">
            {zones.map((zone) => (
              <article className="zone-row reveal" key={zone.name}>
                <span className="zone-number">{zone.number}</span>
                <div>
                  <h3>{zone.name}</h3>
                  <p>{zone.description}</p>
                </div>
                <ul>
                  {zone.specs.map((spec) => <li key={spec}>{spec}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section page-section" aria-labelledby="gallery-title">
          <GlitchHeading eyebrow="Пространство" children="В игре. Не в декорациях." />
          <span id="gallery-title" className="sr-only">Интерьер клуба ProGaming</span>
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <figure className={`gallery-item gallery-item-${index + 1} reveal`} key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                />
                <figcaption>{image.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="reviews" className="reviews-section page-section">
          <GlitchHeading eyebrow="Отзывы" children="Говорят игроки" />
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <article className="review-card reveal" key={review.name}>
                <span className="review-index">0{index + 1}</span>
                <blockquote>«{review.text}»</blockquote>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.meta}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contacts" className="site-footer">
        <div className="footer-brand">
          <a className="brand" href="#top"><span>PRO</span>GAMING</a>
          <p>Твоя точка входа в игру.</p>
        </div>
        <address>
          <span>Уфа, ул. Комсомольская, 12</span>
          <a href="tel:+73472002020">+7 (347) 200-20-20</a>
          <span>Круглосуточно</span>
        </address>
        <div className="socials">
          <a href="https://t.me/progaming_ufa" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://vk.com/progaming_ufa" target="_blank" rel="noreferrer">VK</a>
        </div>
        <p className="copyright">© 2026 ProGaming</p>
      </footer>

      {submitted && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSubmitted(false)}>
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="success-mark" aria-hidden="true">✓</span>
            <p>Заявка принята</p>
            <h2 id="success-title">
              Администратор ProGaming свяжется с вами для подтверждения брони.
            </h2>
            <button
              type="button"
              autoFocus
              onClick={() => {
                setSubmitted(false);
                setBooking(emptyBooking);
              }}
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
}
