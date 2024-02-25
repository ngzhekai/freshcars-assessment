from typing import Union, List
from sqlalchemy.orm import Session

from fastapi import FastAPI, HTTPException, Depends, status, Response
from fastapi.middleware.cors import CORSMiddleware
from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

from datetime import date

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"welcome to the fresh cars rest api backend! for UI docs visit please http:127.0.0.1:8000/docs#/"}

@app.post("/vehicles/", response_model=schemas.Vehicle)
def create_vehicle(vehicle: schemas.VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = crud.get_vehicle_by_carplate(db, carPlate = vehicle.carPlate)
    if db_vehicle:
        raise HTTPException(status_code=400, detail=f"Car Plate {vehicle.carPlate} already exists!")
    return crud.create_vehicle(db=db, vehicle=vehicle)

@app.get("/vehicles/", response_model=list[schemas.VehicleOut], response_model_exclude_unset=True)
def read_vehicles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vehicles = crud.get_vehicles(db=db, skip = skip, limit = limit)
    vehicles_with_company_name = []
    for vehicle in vehicles:
        company_name = crud.get_companyName_by_id(db, company_id=vehicle.companyId)
        vehicle_data = schemas.VehicleOut(
            carPlate=vehicle.carPlate,
            colour=vehicle.colour,
            propellant=vehicle.propellant,
            seats=vehicle.seats,
            expiryDate=vehicle.expiryDate,
            companyName=company_name, 
            companyId=vehicle.companyId
        )
        vehicles_with_company_name.append(vehicle_data)
    return vehicles_with_company_name
#
# @app.get("/companies/")
# def read_companyName(company_id: int, db: Session = Depends(get_db)):
#     return crud.get_companyName_by_id(db, company_id = company_id)

@app.get("/companies/", response_model=list[schemas.Company])
def read_companies(db: Session = Depends(get_db)):
    companies = crud.get_companies(db=db)
    companiesList = []
    for company in companies:
        company_data = schemas.Company(
            id = company.id,
            name = company.companyName
        )
        companiesList.append(company_data)
    return companiesList

@app.delete("/{carPlate}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(carPlate: str, db: Session = Depends(get_db)):
    vehicle_query = crud.query_vehicle(carPlate=carPlate, db=db)
    vehicle = vehicle_query.first()

    if vehicle == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"car with carplate: {carPlate} does not exist!")

    vehicle_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.put("/{carPlate}", response_model=schemas.Vehicle)
def update_vehicle(carPlate:str, updated_vehicle: schemas.VehicleUpdate, db: Session = Depends(get_db)):
    vehicle_query = crud.query_vehicle(carPlate=carPlate, db=db)
    vehicle = vehicle_query.first()

    if vehicle == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"car with carplate: {carPlate} does not exist!")

    company_query = crud.get_companyName_by_id(db, company_id=updated_vehicle.companyId)

    if company_query == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"company with id: {updated_vehicle.companyId} does not exist!")

    vehicle_query.update(updated_vehicle.dict(), synchronize_session=False)
    db.commit()
    return vehicle_query.first()


@app.get("/expiryRange/", response_model=List[schemas.VehicleExpiryDate])
def get_vehicle_by_expiry_date_range(startDate: date, endDate: date, db: Session = Depends(get_db)):
    vehicles = crud.query_vehicles_by_expiry_date(startDate=startDate, endDate=endDate, db=db)

    if vehicles == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No car has expiry date between that falls between {startDate} and {endDate} !")

    vehicles_expiry_result =[]
    for vehicle in vehicles:
        vehicles_expiry_query = schemas.VehicleExpiryDate(
            carPlate = vehicle.carPlate,
            expiryDate = vehicle.expiryDate
        )
        vehicles_expiry_result.append(vehicles_expiry_query)

    return vehicles_expiry_result


