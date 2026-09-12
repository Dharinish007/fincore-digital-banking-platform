"""
FinCore Digital Banking Platform - Unified Service Runner (Team-A)
Supports two modes:
  1. Integrated Terminal Mode (Default): Runs all services inside the Antigravity IDE terminal
     with prefixed real-time logs and single Ctrl+C shutdown.
  2. Windows Mode (--windows / -w): Opens separate interactive terminal windows for each service.
"""

import sys
import os
import time
import signal
import threading
import subprocess
import webbrowser
import argparse
from pathlib import Path

# Ensure UTF-8 output encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend_fincore"

# ANSI Color codes for clean output inside Antigravity Terminal
COLORS = [
    "\033[96m",  # Cyan
    "\033[92m",  # Green
    "\033[93m",  # Yellow
    "\033[94m",  # Blue
    "\033[95m",  # Magenta
    "\033[91m",  # Red
    "\033[36m",  # Dark Cyan
    "\033[32m",  # Dark Green
    "\033[33m",  # Dark Yellow
    "\033[35m",  # Dark Magenta
    "\033[97m",  # White
    "\033[90m",  # Bright Black / Gray
]
RESET = "\033[0m"

SERVICES = [
    {
        "name": "API Gateway",
        "path": BACKEND_DIR / "api-gateway",
        "port": 8080,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[0]
    },
    {
        "name": "Customer Service",
        "path": BACKEND_DIR / "customer-service",
        "port": 8081,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[1]
    },
    {
        "name": "Account Service",
        "path": BACKEND_DIR / "account-service",
        "port": 8082,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[2]
    },
    {
        "name": "Transaction Service",
        "path": BACKEND_DIR / "transaction-service",
        "port": 8083,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[3]
    },
    {
        "name": "Dashboard Service",
        "path": BACKEND_DIR / "dashboard-service",
        "port": 8084,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[4]
    },
    {
        "name": "Loan Service",
        "path": BACKEND_DIR / "loan-service",
        "port": 8085,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[5]
    },
    {
        "name": "Beneficiary Service",
        "path": BACKEND_DIR / "beneficiary-service",
        "port": 8086,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[6]
    },
    {
        "name": "Payment Service",
        "path": BACKEND_DIR / "payment-service",
        "port": 8087,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[7]
    },
    {
        "name": "IMPS-NEFT-UPI Service",
        "path": BACKEND_DIR / "imps-neft-upi-service",
        "port": 8088,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[8]
    },
    {
        "name": "KYC Service",
        "path": BACKEND_DIR / "kyc-service",
        "port": 8089,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[9]
    },
    {
        "name": "Face Match Service",
        "path": BACKEND_DIR / "face-match-service",
        "port": 8090,
        "cmd": "mvn spring-boot:run",
        "color": COLORS[10]
    },
    {
        "name": "Angular Frontend",
        "path": FRONTEND_DIR,
        "port": 4200,
        "cmd": "npm start",
        "color": COLORS[11]
    }
]

running_processes = []
stop_event = threading.Event()

def stream_reader(pipe, prefix, color):
    try:
        for line in iter(pipe.readline, ''):
            if stop_event.is_set():
                break
            if line:
                print(f"{color}[{prefix}]{RESET} {line.rstrip()}", flush=True)
    except Exception:
        pass
    finally:
        pipe.close()

def run_integrated():
    print("=" * 75)
    print("   FINCORE DIGITAL BANKING PLATFORM - INTEGRATED ANTIGRAVITY RUNNER")
    print("=" * 75)
    print(" Running all 11 Spring Boot Microservices and Angular Frontend")
    print(" All logs will stream into this terminal. Press Ctrl+C anytime to stop all.")
    print("=" * 75 + "\n")

    for svc in SERVICES:
        print(f"-> Starting {svc['name']} (Port {svc['port']})...")
        proc = subprocess.Popen(
            svc["cmd"],
            cwd=str(svc["path"]),
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            encoding='utf-8',
            errors='replace'
        )
        running_processes.append((svc["name"], proc))
        
        t = threading.Thread(
            target=stream_reader,
            args=(proc.stdout, svc["name"], svc["color"]),
            daemon=True
        )
        t.start()
        time.sleep(0.6)

    print("\n" + "=" * 75)
    print(" ALL SERVICES LAUNCHED INSIDE ANTIGRAVITY TERMINAL")
    print(" Frontend UI : http://localhost:4200")
    print(" API Gateway : http://localhost:8080")
    print(" Press Ctrl+C in this terminal to shut down all services.")
    print("=" * 75 + "\n")

    def signal_handler(sig, frame):
        print("\n\nShutting down all FinCore services...")
        stop_event.set()
        for name, proc in running_processes:
            try:
                proc.terminate()
            except Exception:
                pass
        # Free ports via stop_all logic
        try:
            import stop_all
            stop_all.kill_ports()
        except Exception:
            pass
        print("Shutdown complete.")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(None, None)

def run_windows():
    print("=" * 75)
    print("       FINCORE DIGITAL BANKING PLATFORM - MULTI-WINDOW RUNNER")
    print("=" * 75)
    for i, svc in enumerate(SERVICES, 1):
        title = f"FinCore - {svc['name']} (Port {svc['port']})"
        print(f"  [{i:02d}/{len(SERVICES):02d}] Launching {svc['name']:<30} on Port {svc['port']}...")
        working_dir_str = str(svc["path"])
        cmd_to_run = f'start "{title}" cmd.exe /k "cd /d "{working_dir_str}" && echo [FinCore] Starting {title}... && {svc["cmd"]}"'
        subprocess.Popen(cmd_to_run, shell=True)
        time.sleep(0.5)

    print("\nAll services launched in dedicated external windows.")
    print("Frontend UI: http://localhost:4200")
    time.sleep(3)
    try:
        webbrowser.open("http://localhost:4200")
    except Exception:
        pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FinCore Service Runner")
    parser.add_argument("-w", "--windows", action="store_true", help="Launch in separate external terminal windows instead of Antigravity terminal")
    args = parser.parse_args()

    if args.windows:
        run_windows()
    else:
        run_integrated()
