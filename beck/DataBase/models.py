from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncAttrs, async_sessionmaker, create_async_engine
from sqlalchemy import Integer, String, ForeignKey, LargeBinary, DateTime, func
import asyncio

database_url = 'mysql+aiomysql://ivent_db.db'
engine = create_async_engine(database_url, echo=True)

class Base (AsyncAttrs, DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    login: Mapped[str] = mapped_column(String(100)) # email
    password: Mapped[str] = mapped_column(String(100))
    first_name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(30))
    age = mapped_column(Integer)
    role: Mapped[str] = mapped_column(String(30))

class Event(Base):
    __tablename__ ='event'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    time: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(1000))
    place = mapped_column(Integer)
    location: Mapped[str] = mapped_column(String(200))
    organizer: Mapped[str] = mapped_column(ForeignKey('users.id'))
    image_data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    create_time: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    role: Mapped[str] = mapped_column(String(30))

class Take_ivent(Base):
    __tablename__ = 'take_event'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_event: Mapped[int] = mapped_column(ForeignKey('event.id'))
    id_user: Mapped[int] = mapped_column(ForeignKey('users.id'))
    inf_person: Mapped[str] = mapped_column(String(150))

async_session= async_sessionmaker(bind=engine, expire_on_commit=False)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Data Base is create")
async def main():
    await create_tables()
asyncio.run(main())