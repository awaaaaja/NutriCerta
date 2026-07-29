import os


def _load_env(path: str):
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())


_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
_load_env(_env_path)


class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL", "https://bzmlrqvpvnpfjilcvgqy.supabase.co")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase_db_url: str = os.getenv("DATABASE_URL", "")


settings = Settings()
