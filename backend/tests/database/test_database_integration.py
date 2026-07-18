from sqlmodel import Session, select
from app.features.crowd.domain.models import CrowdDensityNode


def test_sqlmodel_session_lifecycle(session: Session):
    """Validate that the session is active and can be queried."""
    assert session.is_active

    # Create a node
    node = CrowdDensityNode(
        zone_name="Test Zone", latitude=0.0, longitude=0.0, density_level=50
    )
    session.add(node)
    session.commit()
    session.refresh(node)

    assert node.id is not None
    assert node.zone_name == "Test Zone"


def test_transaction_rollback_isolation(session: Session):
    """Validate that records from previous tests do not persist (transaction isolation)."""
    # Using the same test zone should yield 0 records since the previous test's DB is wiped
    # (or in our fixture, tables are dropped after each test).
    statement = select(CrowdDensityNode).where(
        CrowdDensityNode.zone_name == "Test Zone"
    )
    results = session.exec(statement).all()

    # There should be no records if rollback/isolation works
    assert len(results) == 0


def test_dependency_injection_with_test_db(client):
    """Validate that the test client overrides get_session correctly."""
    response = client.get("/health")
    assert response.status_code == 200
