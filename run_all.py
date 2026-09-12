"""
FinCore Digital Banking Platform - Multi-Terminal Runner & Supervisor (Team-A)
Running this opens a separate interactive terminal window for every single service:
  - Terminal 01: API Gateway (Port 8080)
  - Terminal 02: Customer Service (Port 8081)
  - Terminal 03: Account Service (Port 8082)
  - Terminal 04: Transaction Service (Port 8083)
  - Terminal 05: Dashboard Service (Port 8084)
  - Terminal 06: Loan Service (Port 8085)
  - Terminal 07: Beneficiary Service (Port 8086)
  - Terminal 08: Payment Service (Port 8087)
  - Terminal 09: IMPS-NEFT-UPI Service (Port 8088)
  - Terminal 10: KYC Service (Port 8089)
  - Terminal 11: Face Match Service (Port 8090)
  - Terminal 12: Angular Frontend UI (Port 4200)

This master terminal acts as the Supervisor.
Pressing Ctrl+C here automatically stops ALL opened terminals and frees all ports!
"""

import sys
import os
import time
import socket
import signal
import subprocess
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
    {"num": 1,  "name": "API Gateway",           "path": BACKEND_DIR / "api-gateway",           "port": 8080, "cmd": "mvn spring-boot:run"},
    {"num": 2,  "name": "Customer Service",      "path": BACKEND_DIR / "customer-service",      "port": 8081, "cmd": "mvn spring-boot:run"},
    {"num": 3,  "name": "Account Service",       "path": BACKEND_DIR / "account-service",       "port": 8082, "cmd": "mvn spring-boot:run"},
    {"num": 4,  "name": "Transaction Service",   "path": BACKEND_DIR / "transaction-service",   "port": 8083, "cmd": "mvn spring-boot:run"},
    {"num": 5,  "name": "Dashboard Service",     "path": BACKEND_DIR / "dashboard-service",     "port": 8084, "cmd": "mvn spring-boot:run"},
    {"num": 6,  "name": "Loan Service",          "path": BACKEND_DIR / "loan-service",          "port": 8085, "cmd": "mvn spring-boot:run"},
    {"num": 7,  "name": "Beneficiary Service",   "path": BACKEND_DIR / "beneficiary-service",   "port": 8086, "cmd": "mvn spring-boot:run"},
    {"num": 8,  "name": "Payment Service",       "path": BACKEND_DIR / "payment-service",       "port": 8087, "cmd": "mvn spring-boot:run"},
    {"num": 9,  "name": "IMPS-NEFT-UPI Service", "path": BACKEND_DIR / "imps-neft-upi-service", "port": 8088, "cmd": "mvn spring-boot:run"},
    {"num": 10, "name": "KYC Service",           "path": BACKEND_DIR / "kyc-service",           "port": 8089, "cmd": "mvn spring-boot:run"},
    {"num": 11, "name": "Face Match Service",    "path": BACKEND_DIR / "face-match-service",    "port": 8090, "cmd": "mvn spring-boot:run"},
    {"num": 12, "name": "Angular Frontend UI",   "path": FRONTEND_DIR,                          "port": 4200, "cmd": "npm start"}
]

ALL_PORTS = [s["port"] for s in SERVICES]
is_shutting_down = False

def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.3)
        return s.connect_ex(('127.0.0.1', port)) == 0

def kill_all_services():
    global is_shutting_down
    if is_shutting_down:
        return
    is_shutting_down = True
    print("\n\n" + "=" * 75)
    print(" [FinCore Supervisor] Stopping all opened terminals and freeing ports...")
    print("=" * 75)
    
    for port in ALL_PORTS:
        try:
            output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True, text=True, stderr=subprocess.DEVNULL)
            pids = set()
            for line in output.strip().split('\n'):
                parts = line.strip().split()
                if len(parts) >= 5 and "LISTENING" in line:
                    pids.add(parts[-1])
            for pid in pids:
                subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

    print(" [FinCore Supervisor] All services and ports have been cleanly closed.")
    print("=" * 75 + "\n")

def signal_handler(sig, frame):
    kill_all_services()
    sys.exit(0)

def launch_terminal(svc):
    title = f"Terminal {svc['num']:02d} :: {svc['name']} (Port {svc['port']})"
    cmd_str = f'start "{title}" cmd.exe /k "title {title} && cd /d "{svc["path"]}" && echo ======================================================== && echo  Starting {title} && echo ======================================================== && {svc["cmd"]}"'
    subprocess.Popen(cmd_str, shell=True)

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    print("=" * 75)
    print("   FINCORE DIGITAL BANKING PLATFORM - MULTI-TERMINAL RUNNER (Team-A)")
    print("=" * 75)
    print(f" Root Directory : {ROOT_DIR}")
    print(f" Total Terminals: {len(SERVICES)} (11 Microservices + Angular Frontend)")
    print(" Press Ctrl+C in this master terminal anytime to STOP ALL opened terminals.")
    print("=" * 75 + "\n")

    print(">>> Opening separate terminal windows for each service...\n")
    for svc in SERVICES:
        print(f"  [Terminal {svc['num']:02d}] Opening window for {svc['name']:<25} (Port {svc['port']})...")
        launch_terminal(svc)
        time.sleep(0.7)

    print("\n" + "=" * 75)
    print(" ALL 12 TERMINALS OPENED! LIVE STATUS MONITOR BELOW:")
    print("=" * 75)
    print(f" {'TERMINAL':<12} {'SERVICE NAME':<24} {'PORT':<8} {'STATUS':<14} {'URL'}")
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
                lines.append(f"  Terminal {svc['num']:02d}   {svc['name']:<24} {svc['port']:<8} {status_str:<14} {url}")

            elapsed = int(time.time() - start_time)
            print(f"\n--- FinCore Status (Uptime: {elapsed}s) | Press Ctrl+C to Stop All Terminals ---")
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
        kill_all_services()
        sys.exit(0)

if __name__ == "__main__":
    main()
