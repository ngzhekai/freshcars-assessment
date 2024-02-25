from datetime import date
from pydantic import BaseModel
from typing import Optional

class VehicleBase(BaseModel):
    carPlate: str
    colour: str
    propellant: str
    seats: int
    expiryDate: date
    companyId: int


class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    colour: str
    propellant: str
    seats: int
    expiryDate: date
    companyId: int

class VehicleExpiryDate(BaseModel):
    carPlate: str
    expiryDate: date

class Vehicle(VehicleBase):
    class Config: 
        orm_mode = True

class VehicleOut(VehicleBase):
    companyName: str

    class Config:
        orm_mode = True
    

class CompanyBase(BaseModel):
    name: str

class Company(CompanyBase):
    id: int

    class Config:
        orm_mode = True
