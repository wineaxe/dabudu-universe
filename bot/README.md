# 🤖 Telegram-бот для сбора заявок DaBuDu Universe

Этот бот предназначен для сбора заявок от потенциальных клиентов через Telegram.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
pip install -r requirements.txt
```

### 2. Настройка конфигурации
- Откройте `config.py`
- Вставьте ваш Telegram Bot Token
- Укажите ваш Telegram User ID в `ADMIN_ID`

> Как узнать свой User ID? Напишите боту `@userinfobot`

### 3. Запуск бота
```bash
python main.py
```

## 🗂️ Структура проекта
```
bot/
├── main.py                 # Главный файл для запуска
├── config.py               # Конфигурация (токен, админ ID)
├── database.py             # Работа с базой данных SQLite
├── handlers.py             # Обработка команд и сообщений
├── requirements.txt        # Необходимые библиотеки
├── applications.db         # База данных с заявками
└── README.md               # Эта инструкция
```

## ⚙️ Функционал

### Команды
- `/start` - приветствие и главное меню
- `/order` - начать процесс оформления заявки
- `/cancel` - отменить текущее действие
- `/help` - список команд

### Сбор данных
Бот собирает следующие данные:
- Имя
- Телефон
- Email (опционально)
- Интересующий товар
- Количество
- Дополнительные пожелания

### Уведомления
- Администратор получает мгновенное уведомление о каждой новой заявке.

## 🔧 База данных

Используется `SQLite` для простоты. Все заявки хранятся в файле `applications.db`.

### Структура таблицы `applications`:
```sql
CREATE TABLE applications (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    username TEXT,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    product_interest TEXT,
    quantity INTEGER,
    additional_info TEXT,
    source TEXT,
    created_at TIMESTAMP,
    status TEXT DEFAULT 'new'
);
```

## 📈 Возможные улучшения

- [ ] Интеграция с Google Sheets для экспорта заявок
- [ ] Ежедневная сводка по заявкам для администратора
- [ ] Аналитика и статистика по заявкам
- [ ] Рассылка новостей подписчикам
- [ ] Валидация вводимых данных (телефон, email) 