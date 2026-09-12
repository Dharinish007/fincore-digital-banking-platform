"""
FinCore Digital Banking Platform - Unified Supervisor & Runner (Team-A)
Run this in Terminal 1 inside Antigravity IDE:
- Spawns and manages all 11 Spring Boot Microservices and Angular Frontend.
- Displays a live monitoring dashboard in Terminal 1.
- Automatically kills and frees all services when you press Ctrl+C or 'q'.
"""

import sys
import os
import time
import socket
import signal
import subprocess
import threading
import webbrowser
from pathlib import Path

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend_fincore"

SERVICES = [
    {"name": "API Gateway",          "path": BACKEND_DIR / "api-gateway",          "port": 8080, "cmd": "mvn spring-boot:run"},
    {"name": "Customer Service",     "path": BACKEND_DIR / "customer-service",     "port": 8081, "cmd": "mvn spring-boot:run"},
    {"name": "Account Service",      "path": BACKEND_DIR / "account-service",      "port": 8082, "cmd": "mvn spring-boot:run"},
    {"name": "Transaction Service",  "path": BACKEND_DIR / "transaction-service",  "port": 8083, "cmd": "mvn spring-boot:run"},
    {"name": "Dashboard Service",    "path": BACKEND_DIR / "dashboard-service",    "port": 8084, "cmd": "mvn spring-boot:run"},
    {"name": "Loan Service",         "path": BACKEND_DIR / "loan-service",         "port": 8085, "cmd": "mvn spring-boot:run"},
    {"name": "Beneficiary Service",  "path": BACKEND_DIR / "beneficiary-service",  "port": 8086, "cmd": "mvn spring-boot:run"},
    {"name": "Payment Service",      "path": BACKEND_DIR / "payment-service",      "port": 8087, "cmd": "mvn spring-boot:run"},
    {"name": "IMPS-NEFT-UPI Service","path": BACKEND_DIR / "imps-neft-upi-service","port": 8088, "cmd": "mvn spring-boot:run"},
    {"name": "KYC Service",          "path": BACKEND_DIR / "kyc-service",          "port": 8089, "cmd": "mvn spring-boot:run"},
    {"name": "Face Match Service",   "path": BACKEND_DIR / "face-match-service",   "port": 8090, "cmd": "mvn spring-boot:run"},
    {"name": "Angular Frontend",     "path": FRONTEND_DIR,                         "port": 4200, "cmd": "npm start"}
]

ALL_PORTS = [s["port"] for s in SERVICES]
procs = []
is_shutting_down = False

def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.4)
        return s.connect_ex(('127.0.0.1', port)) == 0

def cleanup_all():
    global is_shutting_down
    if is_shutting_down:
        return
    is_shutting_down = True
    print("\n\n" + "=" * 70)
    print(" [FinCore Supervisor] Stopping all services and freeing ports...")
    print("=" * 70)
    
    # Terminate direct child subprocesses
    for name, proc in procs:
        try:
            proc.terminate()
        except Exception:
            pass

    # Free all listening ports (8080-8090, 4200)
    try:
        for port in ALL_PORTS:
            try:
                output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True, text=True, stderr=subprocess.DEVNULL)
                for line in output.strip().split('\n'):
                    parts = line.strip().split()
                    if len(parts) >= 5 and "LISTENING" in line:
                        pid = parts[-1]
                        subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except Exception:
                pass
    except Exception:
        pass

    print(" [FinCore Supervisor] All services stopped. All ports freed.")
    print("=" * 70 + "\n")

def signal_handler(sig, frame):
    cleanup_all()
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    print("=" * 75)
    print("       FINCORE DIGITAL BANKING PLATFORM - SUPERVISOR (Team-A)")
    print("=" * 75)
    print(f" Root Directory  : {ROOT_DIR}")
    print(f" Total Services  : {len(SERVICES)} (11 Microservices + Angular Frontend)")
    print(" Press Ctrl+C in this terminal at any time to STOP all services.")
    print("=" * 75 + "\n")

    print("[1/2] Starting services in background...\n")
    for i, svc in enumerate(SERVICES, 1):
        print(f"  [{i:02d}/{len(SERVICES):02d}] Launching {svc['name']:<25} (Port {svc['port']})...")
        p = subprocess.Popen(
            svc["cmd"],
            cwd=str(svc["path"]),
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        procs.append((svc["name"], p))
        time.sleep(0.4)

    print("\n[2/2] All services launched! Monitoring live health...\n")
    print("=" * 75)
    print(f" {'SERVICE NAME':<26} {'PORT':<8} {'STATUS':<12} {'ACCESS URL'}")
    print("-" * 75)

    browser_opened = False
    start_time = time.time()

    try:
        while True:
            all_ready = True
            lines = []
            for svc in SERVICES:
                online = is_port_open(svc["port"])
                if not online:
                    all_ready = False
                status_str = "[ONLINE]" if online else "[STARTING...]"
                url = f"http://localhost:{svc['port']}"
                lines.append(f"  {svc['name']:<26} {svc['port']:<8} {status_str:<14} {url}")

            # Print status summary
            elapsed = int(time.time() - start_time)
            header = f"\n--- FinCore Health Monitor (Uptime: {elapsed}s) | Press Ctrl+C to Stop All ---"
            print(header)
            for line in lines:
                print(line)

            if all_ready and not browser_opened:
                browser_opened = True
                print("\n[✓] All services are ONLINE! Opening http://localhost:4200 in browser...")
                try:
                    webbrowser.open("http://localhost:4200")
                except Exception:
                    pass

            time.sleep(5)
    except KeyboardInterrupt:
        cleanup_all()
        sys.exit(0)

if __name__ == "__main__":
    main()
