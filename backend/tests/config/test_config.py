from app.config.config import get_settings


def test_settings_caching():
    # Calling get_settings multiple times should return the exact same instance in memory
    settings_1 = get_settings()
    settings_2 = get_settings()

    assert settings_1 is settings_2


def test_default_settings():
    settings = get_settings()
    # Check default fallbacks
    assert settings.PROJECT_NAME == "InfantinoOrg API"
    assert settings.ENVIRONMENT in ["development", "production", "test"]
    assert hasattr(settings, "DATABASE_URL")
