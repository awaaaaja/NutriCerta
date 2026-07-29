import httpx
from app.config import settings


class SupabaseClient:
    def __init__(self):
        self.url = settings.supabase_url
        self.key = settings.supabase_service_role_key
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _request(self, method: str, path: str, **kwargs):
        url = f"{self.url}/rest/v1/{path.lstrip('/')}"
        headers = {**self.headers, **kwargs.pop("headers", {})}
        with httpx.Client() as client:
            resp = client.request(method, url, headers=headers, **kwargs)
            resp.raise_for_status()
            return resp

    def table(self, table_name: str):
        return TableQuery(self, table_name)


class TableQuery:
    def __init__(self, client: SupabaseClient, table: str):
        self.client = client
        self.table = table
        self._params: list[tuple[str, str]] = []
        self._select_cols = "*"
        self._order_col = None
        self._range_start = None
        self._range_end = None

    def select(self, columns: str = "*"):
        self._select_cols = columns
        return self

    def eq(self, col: str, val):
        self._params.append((f"{col}", f"eq.{val}"))
        return self

    def ilike(self, col: str, pattern: str):
        self._params.append((f"{col}", f"ilike.{pattern}"))
        return self

    def order(self, col: str, direction: str = "asc"):
        self._order_col = f"{col}.{direction}" if direction == "desc" else col
        return self

    def range(self, start: int, end: int):
        self._range_start = start
        self._range_end = end
        return self

    def execute(self):
        headers = {"Prefer": "count=exact"}
        params = [("select", self._select_cols)]

        for k, v in self._params:
            params.append((k, v))

        if self._order_col:
            params.append(("order", self._order_col))

        if self._range_start is not None:
            headers["Range-Unit"] = "items"
            headers["Range"] = f"{self._range_start}-{self._range_end or self._range_start + 99}"

        resp = self.client._request("GET", self.table, params=params, headers=headers)
        return QueryResult(data=resp.json())


class QueryResult:
    def __init__(self, data: list[dict]):
        self.data = data


supabase = SupabaseClient()

