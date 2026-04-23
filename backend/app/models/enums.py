from enum import Enum

# User Role enum
class UserRole(str, Enum):
    admin = "admin"
    agent = "agent"

# Field Stage enum
class FieldStage(str, Enum):
    planted = "Planted"
    growing = "Growing"
    ready = "Ready"
    harvested = "Harvested"