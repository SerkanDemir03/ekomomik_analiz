from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Hizmet Maliyet Analizi API")

# CORS ayarlari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



class AnalysisInput(BaseModel):
    # Abonelik verileri
    sub_monthly_cost: float
    sub_annual_overhead: float
    sub_performance: float  # 0-100
    sub_tasks: List[str]
    
    # Calisan verileri
    emp_monthly_salary: float
    emp_benefits_cost: float  # fixed amount
    emp_hardware_cost: float
    emp_performance: float  # 0-100
    emp_tasks: List[str]
    emp_training_cost: float

@app.post("/analyze")
async def analyze(data: AnalysisInput):
    # Hesaplamalar
    emp_total_monthly = data.emp_monthly_salary + data.emp_benefits_cost
    sub_total_monthly = data.sub_monthly_cost + (data.sub_annual_overhead / 12)
    
    # 12 aylik projeksiyon
    months = list(range(1, 13))
    emp_cumulative_cost = []
    sub_cumulative_cost = []
    
    emp_curr = data.emp_hardware_cost + data.emp_training_cost
    sub_curr = 0
    
    for m in months:
        emp_curr += emp_total_monthly
        sub_curr += sub_total_monthly
        emp_cumulative_cost.append(round(emp_curr, 2))
        sub_cumulative_cost.append(round(sub_curr, 2))
    
    # Performance Analysis
    # Cost per performance point (Lower is better)
    emp_cost_perf = emp_total_monthly / data.emp_performance if data.emp_performance > 0 else 0
    sub_cost_perf = sub_total_monthly / data.sub_performance if data.sub_performance > 0 else 0
    
    # Task overlap/coverage
    all_tasks = list(set(data.sub_tasks) | set(data.emp_tasks))
    sub_coverage = len(data.sub_tasks) / len(all_tasks) if all_tasks else 0
    emp_coverage = len(data.emp_tasks) / len(all_tasks) if all_tasks else 0

    return {
        "cost_analysis": {
            "employee_monthly": round(emp_total_monthly, 2),
            "subscription_monthly": round(sub_total_monthly, 2),
            "difference_monthly": round(emp_total_monthly - sub_total_monthly, 2),
            "breakeven_month": find_breakeven(emp_cumulative_cost, sub_cumulative_cost)
        },
        "performance_analysis": {
            "employee_cost_per_perf": round(emp_cost_perf, 2),
            "subscription_cost_per_perf": round(sub_cost_perf, 2),
            "employee_coverage": round(emp_coverage * 100, 2),
            "subscription_coverage": round(sub_coverage * 100, 2)
        },
        "projections": {
            "months": months,
            "employee_cumulative": emp_cumulative_cost,
            "subscription_cumulative": sub_cumulative_cost
        },
        "recommendation": generate_recommendation(data, emp_total_monthly, sub_total_monthly, emp_cost_perf, sub_cost_perf)
    }

def find_breakeven(emp_costs, sub_costs):
    for i, (e, s) in enumerate(zip(emp_costs, sub_costs)):
        if e < s:
            return i + 1
    return None

def generate_recommendation(data, emp_cost, sub_cost, emp_cp, sub_cp):
    if emp_cp < sub_cp:
        return "Çalışan işe almak, performans başına maliyet açısından daha mantıklı görünüyor."
    elif sub_cp < emp_cp:
        return "Şu anki verilerle abonelik hizmeti daha maliyet etkin görünüyor."
    else:
        return "İki seçenek de benzer maliyet/performans dengesine sahip."

# Mount frontend directory
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
