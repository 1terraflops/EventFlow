from DataBase.models import async_session
from DataBase.models import User, Event, Take_event
from sqlalchemy import select, delete, func
from passlib.hash import bcrypt
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

# Запис користувача
async def record_user(login, password, first_name, last_name, age, role):
    try:    
        validated = validate_email(login, check_deliverability=False)
        normalized_email = validated.normalized    
        async with async_session() as session:
            user = await session.scalar(select(User).where(User.login == normalized_email))
            if user:
                return f"Користувач з ім'ям {login} вже існує"
            if not isinstance(age, int) or age <0:
                return "Невірний формат віку"
            hashed_pass = bcrypt.hash(password)
            session.add(User(
                login=normalized_email,
                password=hashed_pass,
                first_name=first_name.strip(),
                last_name=last_name.strip(),
                age=age,
                role=role
                ))
            await session.commit()
            return f"Користувач з логіном {normalized_email} був доданий в бд"
    except EmailNotValidError:
        return "Написаний не правильна пошта"
    except Exception as a:
        return f"Помилка \n{a}"
        
# Запис івенту
async def record_event (id_user, name, description, location, time, image_data, role, place):
    async with async_session() as session:
        try:
            if not all([name.strip(), description.strip(), location.strip()]):
                return "Назва опис та локація не може бути порожніми"
            if time < datetime.now():
                return "Запис часу івенту не може бути в минулому часі"
            result = await session.scalar(select(User).where(User.id==id_user))
            if not result:
                return "Користувача не знайдено в базі"
            session.add( Event(
                name=name.strip(),
                description=description.strip(),
                place=place,
                location=location.strip(),
                time=time,
                organizer=result.id,
                image_data=image_data,
                role=role
            ))
            await session.commit()
            return "Івент записаний"
        except SQLAlchemyError as e:
            await session.rollback()
            return f"Помилка в базі данних {e}"
        except Exception as a:
            return f"Невідома помилка {a}"
        
# Підписка на івент
async def subscribe_event (id_user, id_ivent):
    async with async_session() as session:
        try:
            user = await session.scalar(select(User).where(User.id==id_user))
            if not user:
                return False, "Користувача не знайдено"
            event = await session.scalar(select(Event).where(Event.id==id_ivent))
            if not event:
                return False, "Івент не знайдено"
            if event.time < datetime.now():
                return False, "Івент вже завершився"
            excisting_sub = await session.scalar(select(Take_event).where(
                Take_event.id_user==id_user,
                Take_event.id_event==id_ivent
            ))
            if excisting_sub:
                return False, "Ви вже записані на івент"
            session.add(Take_event(
                id_event=event.id,
                id_user=user.id
            ))
            await session.commit()
            return True, "Успішна підписка на івент"
        except SQLAlchemyError as e:
            return f"Проблема в базі данних {e}"
        except Exception as a:
            return f"Виникла помилка {a}"

# Вивід юзерів також дозволено вивід логіну і паролю
async def user_output():
    async with async_session() as session:
        return await session.scalars(select(User))

# Вивід івентів
async def event_output():
    async with async_session() as session:
        return await session.scalars(select(Event))

# Вивід івента для організатора
async def organizer_event(user_id):
    async with async_session() as session:
        return await session.scalars(select(Event).where(Event.organizer==user_id))

# Вивід івентів для юзера де він бере участь
async def event_for_user(user_id):
    async with async_session() as session:
        result = await session.execute(select(Event).join(
            Take_event, Take_event.id_event==Event.id).where(
                Take_event.id_user==user_id))
        return result.scalars().all()
    
# Вивід учасників для організатора
async def info_about_user(event_id):
    async with async_session() as session:
        result = await session.execute(select(User).join(
            Take_event, Take_event.id_user==User.id).where(
            Take_event.id_event==event_id))
        return result.scalars().all()

# Редагування логіну
async def edit_login(login):
    async with async_session() as session:
        result = await session.scalar(select(User).where(User.login==login))
        if result:
            return "Логін вже зайнятий"
        result.login=login
        await session.commit()

#Редагування паролю
async def edit_password(login, password):
    async with async_session() as session:
        result = await session.scalar(select(User).where(User.login==login))
        hashed_pass = bcrypt.hash(password)
        result.password=hashed_pass
        await session.commit()

# Редагувати юзера
async def edit_user(id, first_name, last_name, age, role):
    async with async_session() as session:
        user = await session.scalar(select(User).where(User.id==id))
        user.first_name=first_name
        user.last_name=last_name
        user.age=age
        user.role=role
        await session.commit()
   
# Редагувати евента
async def edit_event(id,name,time,description,place,location,image_data,role):
    async with async_session() as session:
        event = await session.scalar(select(Event).where(Event.id==id))
        event.name=name
        event.time=time
        event.description=description
        event.place=place
        event.location=location
        event.image_data=image_data
        event.role=role
        await session.commit()
   
# Видалити участь в івенті
async def delete_activity (id_user, id_event):
    async with async_session() as session:
        subscription = await session.scalar(select(Take_event).where(
            Take_event.id_user==id_user,
            Take_event.id_event==id_event))
        if not subscription:
            return False, "Запис не знайдено"
        await session.delete(subscription)
        await session.commit()

# Видалити івент
async def delete_event(id_event):
    async with async_session() as session:
        event = await session.scalar(select(Event).where(Event.id==id_event))
        if not event:
            return "Івент не знайдено"
        await session.delete(event)
        await session.commit()

# Видалити юзера
async def delete_user(id_user):
    async with async_session() as session:
        user = await session.scalar(select(User).where(User.id==id_user))
        if not user:
            return "Юзера не знайдено"
        await session.delete(user)
        await session.commit()