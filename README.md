<div align="center">

<h1>
Мій персональний сайт-портфоліо у стилі терміналу.
</h1>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000">
<img src="https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff">

</div>

## Технології

- HTML, CSS, JS — без фреймворків та збірників
- Google Fonts: Space Grotesk, Inter, JetBrains Mono
- Анімація друку в терміналі на чистому JS
- Адаптивна верстка, бургер-меню
- `prefers-reduced-motion` — повага до системних налаштувань

## Локальний запуск

```bash
# просто відкрий index.html у браузері
# або через Live Server
npx live-server
```

## Структура

```
index.html   — розмітка
style.css    — всі стилі
script.js    — логіка (термінали, скрол, меню)
img/         — зображення
```

## Фічі

- Герой-термінал із друком команд `whoami`, `ls projects`, `uptime` та ін.
- Контактний термінал із командами `/help`, `/mail`, `/github` тощо
- Навбар ховається при скролі вниз, з'являється при скролі вгору
- Прогрес-бар читання сторінки
- Темна тема, мінімалістичний дизайн
