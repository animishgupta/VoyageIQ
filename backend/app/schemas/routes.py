from pydantic import BaseModel, Field, model_validator

class RouteQuery(BaseModel):
    start_city: str = Field(..., description="Starting city (e.g., Lucknow)")
    end_city: str = Field(..., description="Destination city (e.g., Dehradun)")
    cost_weight: float = Field(0.4, ge=0.0, le=1.0, description="Weight given to trip cost")
    time_weight: float = Field(0.4, ge=0.0, le=1.0, description="Weight given to travel duration")
    scenic_weight: float = Field(0.2, ge=0.0, le=1.0, description="Weight given to scenery score")

    @model_validator(mode="after")
    def validate_weights_sum(self) -> "RouteQuery":
        total = self.cost_weight + self.time_weight + self.scenic_weight
        if abs(total - 1.0) > 1e-3:
            raise ValueError(
                f"Weights (cost_weight={self.cost_weight}, "
                f"time_weight={self.time_weight}, "
                f"scenic_weight={self.scenic_weight}) "
                f"must sum to 1.0. Currently sums to {total}."
            )
        return self
