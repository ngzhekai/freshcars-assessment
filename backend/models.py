from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship

from .database import Base


class CarProperty(Base):
    __tablename__ = "car_properties"
    carPlate = Column(String,primary_key=True, nullable=False)
    colour = Column(String, nullable=False)
    propellant = Column(String, nullable=False)
    seats = Column(Integer, nullable=False)
    expiryDate = Column(Date, nullable=False)
    companyId = Column(Integer, ForeignKey('car_company.id'))

    company = relationship("CarCompany", back_populates="cars")

class CarCompany(Base):
    __tablename__ = "car_company"

    id = Column(Integer, primary_key=True, nullable=False)
    companyName = Column(String, nullable=False)

    cars = relationship("CarProperty", back_populates="company")

