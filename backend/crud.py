from sqlalchemy.orm import Session

from . import models, schemas

from datetime import date

# def get_vehicle(db: Session, vehicle_id: int):
#     return db.query(models.Vehicle).filter(models.Vehicle.Id == vehicle_id).first()

def get_vehicle_by_carplate(db: Session, carPlate: str):
    return db.query(models.CarProperty).filter(models.CarProperty.carPlate == carPlate).first()

def get_vehicles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CarProperty)\
        .offset(skip).limit(limit).all() 

# query companies for displaying on drop down
def get_companies(db: Session):
    return db.query(models.CarCompany).all()


def get_companyName_by_id(db: Session, company_id: int):
    company_name =  db.query(models.CarCompany.companyName).filter(models.CarCompany.id == company_id).first()
    if company_name:
        return company_name[0]
    else:
        return None

def create_vehicle(db: Session, vehicle: schemas.VehicleCreate):
    db_vehicle = models.CarProperty(carPlate = vehicle.carPlate, colour = vehicle.colour, propellant = vehicle.propellant, seats = vehicle.seats, expiryDate = vehicle.expiryDate, companyId = vehicle.companyId)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def query_vehicle(db: Session, carPlate: str):
   return db.query(models.CarProperty).filter(models.CarProperty.carPlate == carPlate)


def query_vehicles_by_expiry_date(db: Session, startDate: date, endDate: date):
    return db.query(models.CarProperty).filter(models.CarProperty.expiryDate >= startDate, models.CarProperty.expiryDate <= endDate).all()




