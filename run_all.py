"""
FinCore Digital Banking Platform - Unified Service Runner
Runs all 11 Spring Boot Microservices and Angular Frontend in separate interactive terminal windows.
"""

import sys
import time
import subprocess
import webbrowser
from pathlib import Path

# Ensure UTF-8 output encoding for Windows command prompt
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend_fincore"

SERVICES = [
    {
        "name": "API Gateway",
        "path": BACKEND_DIR / "api-gateway",
        "port": 8080,
        "cmd": "mvn spring-boot:run",
        "category": "Gateway"
    },
    {
        "name": "Customer Service",
        "path": BACKEND_DIR / "customer-service",
        "port": 8081,
        "cmd": "mvn spring-boot:run",
        "category": "Core"
    },
    {
        "name": "Account Service",
        "path": BACKEND_DIR / "account-service",
        "port": 8082,
        "cmd": "mvn spring-boot:run",
        "category": "Core"
    },
    {
        "name": "Transaction Service",
        "path": BACKEND_DIR / "transaction-service",
        "port": 8083,
        "cmd": "mvn spring-boot:run",
        "category": "Core"
    },
    {
        "name": "Dashboard Service",
        "path": BACKEND_DIR / "dashboard-service",
        "port": 8084,
        "cmd": "mvn spring-boot:run",
        "category": "Core"
    },
    {
        "name": "Loan Service",
        "path": BACKEND_DIR / "loan-service",
        "port": 8085,
        "cmd": "mvn spring-boot:run",
        "category": "Services"
    },
    {
        "name": "Beneficiary Service",
        "path": BACKEND_DIR / "beneficiary-service",
        "port": 8086,
        "cmd": "mvn spring-boot:run",
        "category": "Services"
    },
    {
        "name": "Payment Service",
        "path": BACKEND_DIR / "payment-service",
        "port": 8087,
        "cmd": "mvn spring-boot:run",
        "category": "Payments"
    },
    {
        "name": "IMPS-NEFT-UPI Service",
        "path": BACKEND_DIR / "imps-neft-upi-service",
        "port": 8088,
        "cmd": "mvn spring-boot:run",
        "category": "Payments"
    },
    {
        "name": "KYC Service",
        "path": BACKEND_DIR / "kyc-service",
        "port": 8089,
        "cmd": "mvn spring-boot:run",
        "category": "Verification"
    },
    {
        "name": "Face Match Service",
        "path": BACKEND_DIR / "face-match-service",
        "port": 8090,
        "cmd": "mvn spring-boot:run",
        "category": "AI / Biometrics"
    },
]

FRONTEND = {
    "name": "Angular Frontend UI",
    "path": FRONTEND_DIR,
    "port": 4200,
    "cmd": "npm start",
    "category": "Frontend"
}

def launch_in_new_terminal(title: str, working_dir: Path, command: str):
    """
    Launches a command in a separate interactive Windows terminal.
    Uses start cmd /k so the terminal stays open and interactive even if interrupted.
    """
    working_dir_str = str(working_dir)
    # Using start command on Windows with proper escaping
    cmd_to_run = f'start "{title}" cmd.exe /k "cd /d "{working_dir_str}" && echo [FinCore] Starting {title}... && {command}"'
    subprocess.Popen(cmd_to_run, shell=True)

def print_banner():
    print("=" * 75)
    print("       FINCORE DIGITAL BANKING PLATFORM - RUNNER (Team-A)")
    print("=" * 75)
    print(f" Root Directory: {ROOT_DIR}")
    print(f" Backend Services: {len(SERVICES)}")
    print(" Frontend UI: Angular 18 (Port 4200)")
    print("=" * 75)

def start_all():
    print_banner()
    print("\n[1/3] Launching API Gateway & Backend Microservices in separate terminals...\n")
    
    for i, svc in enumerate(SERVICES, 1):
        title = f"FinCore - {svc['name']} (Port {svc['port']})"
        print(f"  [{i:02d}/{len(SERVICES):02d}] Launching {svc['name']:<30} on Port {svc['port']}...")
        launch_in_new_terminal(title, svc["path"], svc["cmd"])
        time.sleep(0.5)

    print("\n[2/3] Launching Angular 18 Frontend UI in separate terminal...\n")
    fe_title = f"FinCore - {FRONTEND['name']} (Port {FRONTEND['port']})"
    print(f"  Launching {FRONTEND['name']} on Port {FRONTEND['port']}...")
    launch_in_new_terminal(fe_title, FRONTEND["path"], FRONTEND["cmd"])

    print("\n[3/3] All services launched in dedicated interactive terminals!\n")
    print("=" * 75)
    print(" ACCESS URLS:")
    print(" -------------------------------------------------------------------------")
    print("  [*] Frontend UI        : http://localhost:4200")
    print("  [*] API Gateway        : http://localhost:8080")
    print("  [*] Gateway Health     : http://localhost:8080/actuator/health")
    print("  [*] Customer Service   : http://localhost:8081/api/v1/customers")
    print("  [*] Account Service    : http://localhost:8082/api/v1/accounts")
    print("  [*] Transaction Service: http://localhost:8083/api/v1/transactions")
    print("  [*] Dashboard Service  : http://localhost:8084/api/v1/dashboard")
    print("  [*] Loan Service       : http://localhost:8085/api/v1/loans")
    print("  [*] Beneficiary Service: http://localhost:8086/api/v1/beneficiaries")
    print("  [*] Payment Service    : http://localhost:8087/api/v1/payments")
    print("  [*] IMPS/NEFT/UPI      : http://localhost:8088/api/v1/payment-modes")
    print("  [*] KYC Service        : http://localhost:8089/api/v1/kyc")
    print("  [*] Face Match Service : http://localhost:8090/api/v1/face-match")
    print("=" * 75)
    print("\n[i] Each service runs in its own window. You can interact, view logs, or restart any service independently.")
    print("[i] Opening frontend in your default browser...\n")
    
    time.sleep(3)
    try:
        webbrowser.open("http://localhost:4200")
    except Exception:
        pass

if __name__ == "__main__":
    start_all()
