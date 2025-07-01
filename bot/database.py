import aiosqlite

async def init_db():
    """
    Инициализирует базу данных и создает таблицу applications, если она не существует.
    """
    async with aiosqlite.connect('applications.db') as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS applications (
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
            )
        ''')
        await db.commit()

async def add_application(data):
    """
    Добавляет новую заявку в базу данных.

    Args:
        data (dict): Словарь с данными заявки.

    Returns:
        int: ID последней вставленной записи.
    """
    async with aiosqlite.connect('applications.db') as db:
        cursor = await db.execute('''
            INSERT INTO applications (user_id, username, full_name, phone, email, product_interest, quantity, additional_info, source, created_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['user_id'],
            data['username'],
            data['full_name'],
            data['phone'],
            data['email'],
            data['product_interest'],
            data['quantity'],
            data['additional_info'],
            data['source'],
            data['created_at'],
            'new'
        ))
        await db.commit()
        return cursor.lastrowid 