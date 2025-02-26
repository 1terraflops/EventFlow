from DataBase.models import async_session
from DataBase.models import User, Event, Take_ivent
from sqlalchemy import select, update, delete, func
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
            new_user = User(
                login=normalized_email,
                password=hashed_pass,
                first_name=first_name.strip(),
                last_name=last_name.strip(),
                age=age,
                role=role
                )
            session.add(new_user)
            await session.commit()
            return f"Користувач з логіном {normalized_email} був доданий в бд"
    except EmailNotValidError:
        return "Написаний не правильна пошта"
    except Exception as a:
        return f"Помилка \n{a}"
        
# Запис івенту
async def record_event (id_user, name, description, location, time, image_data, role, plase):
    async with async_session() as session:
        try:
            if not all([name.strip(), description.strip(), location.strip()]):
                return "Назва опис та локація не може бути порожніми"
            if time < datetime.now():
                return "Запис часу івенту не може бути в минулому часі"
            result = await session.scalar(select(User).where(User.id==id_user))
            if not result:
                return "Користувача не знайдено в базі"
            new_event = Event(
                name=name.strip(),
                description=description.strip(),
                plase=plase,
                location=location.strip(),
                time=time,
                organizer=result.id,
                image_data=image_data,
                role=role
            )
            session.add(new_event)
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
            excisting_sub = await session.scalar(select(Take_ivent).where(
                Take_ivent.id_user==id_user,
                Take_ivent.id_event==id_ivent
            ))
            if excisting_sub:
                return False, "Ви вже записані на івент"
            subscribe = Take_ivent(
                id_event=event.id,
                id_user=user.id
            )
            session.add(subscribe)
            await session.commit()
            return True, "Успішна підписка на івент"
        except SQLAlchemyError as e:
            return f"Проблема в базі данних {e}"
        except Exception as a:
            return f"Виникла помилка {a}"
    
        
    