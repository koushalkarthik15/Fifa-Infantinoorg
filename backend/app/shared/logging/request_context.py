from contextvars import ContextVar

request_id_var: ContextVar[str] = ContextVar("request_id", default="")
request_method_var: ContextVar[str] = ContextVar("request_method", default="")
request_path_var: ContextVar[str] = ContextVar("request_path", default="")

def get_request_id() -> str:
    return request_id_var.get()

def set_request_id(request_id: str) -> None:
    request_id_var.set(request_id)

def get_request_method() -> str:
    return request_method_var.get()

def set_request_method(method: str) -> None:
    request_method_var.set(method)

def get_request_path() -> str:
    return request_path_var.get()

def set_request_path(path: str) -> None:
    request_path_var.set(path)
