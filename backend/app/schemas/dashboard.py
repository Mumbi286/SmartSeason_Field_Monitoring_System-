from pydantic import BaseModel

# Dashboard Summary Response Schema
class DashboardSummaryResponse(BaseModel):
    total: int # Total number of fields in the database
    active: int # Number of active fields in the database
    atRisk: int     # Number of fields at risk in the database
    completed: int # Number of completed fields in the database
