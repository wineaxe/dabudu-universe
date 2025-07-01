import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from config import BOT_TOKEN
from handlers import router
from database import init_db

async def main():
    """
    Основная функция для запуска Telegram-бота.

    Инициализирует базу данных, создает объекты бота и диспетчера,
    регистрирует обработчики и запускает опрос обновлений.
    """
    logging.basicConfig(level=logging.INFO)

    # Инициализация базы данных
    await init_db()

    # Создание объектов бота и диспетчера
    bot = Bot(token=BOT_TOKEN)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    # Регистрация обработчиков
    dp.include_router(router)

    # Запуск бота
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main()) 