from aiogram import Router, F
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import Command, CommandStart, CommandObject
from datetime import datetime
from database import add_application
from config import ADMIN_ID

router = Router()

# Карта продуктов для deep link
PRODUCT_MAP = {
    'dabudu': 'Дабуду - Хранитель Мечты',
    'luminus': 'Люминус - Страж Света',
    'dabldooo': 'Дабл Дооо - Победитель Страхов',
    'triostrazha': 'Набор "Три Стража"',
    'dabudupremium': 'Дабуду Премиум',
    'startnabor': 'Стартовый набор'
}

# Клавиатура с основными кнопками
main_keyboard = ReplyKeyboardMarkup(keyboard=[
    [KeyboardButton(text="📝 Оставить заявку")],
    [KeyboardButton(text="📊 О товаре"), KeyboardButton(text="📞 Связаться с нами")],
    [KeyboardButton(text="❓ Помощь")]
], resize_keyboard=True)

class OrderForm(StatesGroup):
    """
    Состояния для машины состояний сбора заявки.
    """
    full_name = State()
    phone = State()
    email = State()
    product_interest = State()
    quantity = State()
    additional_info = State()

@router.message(CommandStart())
async def start_handler(message: Message, state: FSMContext, command: CommandObject):
    await state.clear()
    args = command.args

    if args and args in PRODUCT_MAP:
        product_name = PRODUCT_MAP[args]
        await state.update_data(product_interest=product_name, source=args)
        await state.set_state(OrderForm.full_name)
        await message.answer(
            f"👋 Добро пожаловать в DabuDu Store!\n\n"
            f"Вы хотите оставить заявку на **{product_name}**. Отлично!\n\n"
            "Давайте начнем. Как вас зовут?",
            parse_mode="Markdown"
        )
    else:
        await message.answer(
            "👋 Добро пожаловать в DabuDu Store!\n\n"
            "Здесь вы можете оставить заявку на наш товар и узнать о нем подробнее.\n\n"
            "Нажмите '📝 Оставить заявку' чтобы начать!",
            reply_markup=main_keyboard
        )

@router.message(F.text == "📝 Оставить заявку")
@router.message(Command("order"))
async def order_handler(message: Message, state: FSMContext):
    """
    Начинает процесс сбора заявки и запрашивает имя пользователя.
    """
    await state.set_state(OrderForm.full_name)
    await message.answer("📝 Отлично! Давайте оформим вашу заявку.\n\nКак вас зовут?\nНапишите ваше имя или ФИО")

@router.message(OrderForm.full_name)
async def process_name(message: Message, state: FSMContext):
    """
    Обрабатывает введенное имя и запрашивает номер телефона.
    """
    await state.update_data(full_name=message.text)
    await state.set_state(OrderForm.phone)
    await message.answer("Введите ваш номер телефона.")

@router.message(OrderForm.phone)
async def process_phone(message: Message, state: FSMContext):
    """
    Обрабатывает введенный номер телефона и запрашивает email.
    """
    await state.update_data(phone=message.text)
    await state.set_state(OrderForm.email)
    await message.answer("Введите ваш email (или напишите 'пропустить').")

@router.message(OrderForm.email)
async def process_email(message: Message, state: FSMContext):
    """
    Обрабатывает email и запрашивает интересующий товар.
    """
    if message.text.lower() != 'пропустить':
        await state.update_data(email=message.text)
    else:
        await state.update_data(email='-')
        
    user_data = await state.get_data()
    if 'product_interest' in user_data:
        await state.set_state(OrderForm.quantity)
        await message.answer("Какое количество вас интересует?")
    else:
        await state.set_state(OrderForm.product_interest)
        await message.answer("Какой товар вас интересует?")

@router.message(OrderForm.product_interest)
async def process_product_interest(message: Message, state: FSMContext):
    """
    Обрабатывает интересующий товар и запрашивает количество.
    """
    await state.update_data(product_interest=message.text)
    await state.set_state(OrderForm.quantity)
    await message.answer("Какое количество вас интересует?")

@router.message(OrderForm.quantity)
async def process_quantity(message: Message, state: FSMContext):
    """
    Обрабатывает количество и запрашивает доп. информацию.
    """
    await state.update_data(quantity=message.text)
    await state.set_state(OrderForm.additional_info)
    await message.answer("Есть ли у вас дополнительные пожелания? (или напишите 'нет')")

@router.message(OrderForm.additional_info)
async def process_additional_info(message: Message, state: FSMContext):
    """
    Обрабатывает доп. информацию, сохраняет заявку и отправляет уведомления.
    """
    if message.text.lower() != 'нет':
        await state.update_data(additional_info=message.text)
    else:
        await state.update_data(additional_info='-')

    # Собираем все данные
    user_data = await state.get_data()
    user_data['user_id'] = message.from_user.id
    user_data['username'] = message.from_user.username or '-'
    user_data['created_at'] = datetime.now()
    if 'source' not in user_data:
        user_data['source'] = 'telegram'
    
    # Сохраняем в БД
    application_id = await add_application(user_data)
    
    # Отправляем подтверждение пользователю
    await message.answer(
        f"✅ Заявка №{application_id} успешно отправлена!\n\n"
        f"📋 Ваши данные:\n"
        f"👤 Имя: {user_data['full_name']}\n"
        f"📞 Телефон: {user_data['phone']}\n"
        f"📧 Email: {user_data.get('email', '-')}\n"
        f"🛍 Товар: {user_data['product_interest']}\n"
        f"🔢 Количество: {user_data['quantity']}\n\n"
        "Мы свяжемся с вами в течение 24 часов!",
        reply_markup=main_keyboard
    )
    
    # Отправляем уведомление админу
    if ADMIN_ID:
        admin_message = (
            f"🔔 Новая заявка №{application_id} (Источник: {user_data['source']})\n\n"
            f"👤 Имя: {user_data['full_name']}\n"
            f"📞 Телефон: {user_data['phone']}\n"
            f"📧 Email: {user_data.get('email', '-')}\n"
            f"🛍 Товар: {user_data['product_interest']}\n"
            f"🔢 Количество: {user_data['quantity']}\n"
            f"📝 Пожелания: {user_data['additional_info']}\n"
            f"👤 Telegram: @{user_data['username']} (ID: {user_data['user_id']})"
        )
        await message.bot.send_message(ADMIN_ID, admin_message)

    await state.clear()

@router.message(F.text == "📊 О товаре")
async def about_product(message: Message):
    await message.answer(
        "**Вселенная Дабуду** — это не просто игрушки, а настоящие наставники для ваших детей! "
        "Каждый персонаж создан для развития определенных качеств: уверенности, творчества и эмоционального интеллекта.\n\n"
        "Узнать больше можно на нашем сайте: [ссылка на сайт]", 
        parse_mode="Markdown"
    )

@router.message(F.text == "📞 Связаться с нами")
async def contact_us(message: Message):
    await message.answer(
        "Вы всегда можете связаться с нами:\n\n"
        "📧 Email: Support@dabudu.store\n"
        "📞 Телефон: +7 (999) 123-45-67\n"
        "Или просто напишите ваш вопрос здесь, и мы скоро ответим!"
    )

@router.message(F.text == "❓ Помощь")
@router.message(Command("help"))
async def help_handler(message: Message):
    """
    Обработчик кнопки "Помощь". Отображает список доступных команд.
    """
    await message.answer(
        "Список доступных команд:\n"
        "/start - Перезапустить бота\n"
        "/order - Оставить заявку\n"
        "/cancel - Отменить текущую операцию"
    )

@router.message(Command("cancel"))
@router.message(F.text.casefold() == "отмена")
async def cancel_handler(message: Message, state: FSMContext):
    """
    Отменяет текущую операцию и возвращает в главное меню.
    """
    current_state = await state.get_state()
    if current_state is None:
        await message.answer("Нет активных действий для отмены.", reply_markup=main_keyboard)
        return

    await state.clear()
    await message.answer(
        "Действие отменено.",
        reply_markup=main_keyboard,
    )

# Этот обработчик должен быть последним
@router.message()
async def any_other_message(message: Message, state: FSMContext):
    """
    Обрабатывает любые другие сообщения, которые не соответствуют другим обработчикам.
    """
    # Если пользователь в процессе заполнения формы, не перебиваем его
    if await state.get_state() is not None:
        # Можно добавить логику подсказок, если пользователь "застрял"
        return

    await message.answer("Я не понимаю эту команду. Воспользуйтесь кнопками ниже.", reply_markup=main_keyboard) 