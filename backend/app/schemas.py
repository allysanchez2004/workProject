from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# ... keep your existing User*, Token*, Transaction*, Mortgage*, Budget*, Dashboard* ...

class InvestmentCreate(BaseModel):
    ticker: str
    asset_type: str = "stock"          # stock | etf | crypto | bond | cash | other
    account_name: str = ""             # optional: roth | 401k | brokerage | etc.
    shares: float = 0.0
    avg_cost: float = 0.0
    notes: str = ""

class InvestmentOut(BaseModel):
    id: int
    ticker: str
    asset_type: str
    account_name: str
    shares: float
    avg_cost: float
    notes: str
    class Config:
        from_attributes = True


class CarCreate(BaseModel):
    make: str
    model: str
    year: int
    car_type: str = "sedan"            # sedan | suv | truck | coupe | hatchback | van | other
    nickname: str = ""

class CarOut(BaseModel):
    id: int
    make: str
    model: str
    year: int
    car_type: str
    nickname: str
    created_at: datetime

    class Config:
        from_attributes = True
