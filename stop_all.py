"""
FinCore Digital Banking Platform - Service Stopper
Kills running processes listening on ports 8080-8090 and 4200.
"""

import subprocess
import re

PORTS = [8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090, 4200]

def kill_ports():
    print("=" * 60)
    print("      FinCore - Stopping Services on Ports 8080-8090 & 4200")
    print("=" * 60)
    
    for port in PORTS:
        try:
            output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True, text=True, stderr=subprocess.DEVNULL)
            lines = output.strip().split('\n')
            pids = set()
            for line in lines:
                parts = line.strip().split()
                if len(parts) >= 5 and "LISTENING" in line:
                    pid = parts[-1]
                    pids.add(pid)
            
            for pid in pids:
                print(f"  Killing PID {pid} listening on port {port}...")
                subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

    print("\n✅ All FinCore ports freed.")

if __name__ == "__main__":
    kill_ports()
