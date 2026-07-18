from fastapi import APIRouter, Depends
from app.shared.api.models import APIResponse
from app.features.volunteer.services.volunteer_service import VolunteerService
from app.features.volunteer.schemas.volunteer import IncidentRequest, IncidentResponse

router = APIRouter(tags=["Volunteer AI"])


def get_volunteer_service() -> VolunteerService:
    return VolunteerService()


@router.post("/incident", response_model=APIResponse[IncidentResponse])
async def report_incident(
    request: IncidentRequest, service: VolunteerService = Depends(get_volunteer_service)
) -> APIResponse[IncidentResponse]:
    result = await service.report_incident(request)
    return APIResponse(success=True, message="Incident processed.", data=result)
