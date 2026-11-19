from collections.abc import AsyncGenerator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    pass


def _prepare_db_engine():
    raw_url = settings.DATABASE_URL
    if raw_url.startswith("sqlite"):
        return create_async_engine(raw_url, echo=False, future=True)

    parsed = urlsplit(raw_url)
    scheme = parsed.scheme

    if scheme in ("postgresql", "postgres"):
        scheme = "postgresql+asyncpg"

    query_params = parse_qsl(parsed.query)
    filtered_query = [
        (k, v)
        for k, v in query_params
        if k.lower() not in ("sslmode", "channel_binding")
    ]
    new_query = urlencode(filtered_query)

    cleaned_url = urlunsplit(
        (scheme, parsed.netloc, parsed.path, new_query, parsed.fragment)
    )

    connect_args = {}
    is_localhost = (
        parsed.hostname in ("localhost", "127.0.0.1", "::1")
        if parsed.hostname
        else False
    )
    if "asyncpg" in scheme and not is_localhost:
        connect_args["ssl"] = "require"
        connect_args["statement_cache_size"] = 0

    return create_async_engine(
        cleaned_url,
        echo=False,
        future=True,
        pool_pre_ping=True,
        pool_recycle=240,
        pool_size=5,
        max_overflow=10,
        connect_args=connect_args,
    )


engine = _prepare_db_engine()

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    # Ensure models are loaded before creating tables
    import app.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
