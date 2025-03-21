# Sigma Практика

## Відео демонстрація

[![Демонстрація проєкту](https://img.youtube.com/vi/eLj8xczpjpI/0.jpg)](https://youtu.be/eLj8xczpjpI)

Проєкт складається з серверної частини (backend), написаної на Django (Python), та клієнтської частини (frontend), написаної на TypeScript.

## Налаштування та запуск проєкту

### Налаштування бази даних

Проєкт використовує MySQL базу даних з наступними параметрами:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': 'ivent_db',
        'USER': 'user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

Переконайтеся, що ви маєте встановлений MySQL сервер та створену базу даних з назвою `ivent_db`. Користувач `user` з паролем `password` повинен мати права доступу до цієї бази даних.

### Запуск Backend (Django)

1. Переконайтеся, що у вас встановлений Python та необхідні залежності
2. Перейдіть до директорії з проєктом
3. Запустіть сервер за допомогою команди:

```bash
python manage.py runserver
```

Після запуску, сервер буде доступний за адресою http://localhost:8000

### Запуск Frontend (TypeScript)

1. Переконайтеся, що у вас встановлений Node.js та npm
2. Перейдіть до директорії з frontend проєктом
3. Запустіть збірку за допомогою команди:

```bash
npm run build
```

Після запуску, сервер буде доступний за адресою http://localhost:3000

