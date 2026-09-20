# ==============================================================================
# FinCore Digital Banking Platform - Unified PowerShell Runner (Team-A + Team-D)
# Runs all Team A + Team D Spring Boot Microservices and Angular Frontend
# ==============================================================================

$RootDir = $PSScriptRoot
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend_fincore"

function Start-ServiceWindow {
    param(
        [string]$Name,
        [string]$Path,
        [int]$Port,
        [string]$Command
    )
    $title = "FinCore :: $Name (Port $Port)"
    $psCmd = "title '$title'; cd '$Path'; Write-Host '[FinCore] Starting $title...' -ForegroundColor Cyan; $Command"
    Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-Command", $psCmd) -WorkingDirectory $Path
    Write-Host "  -> Launched $Name (Port $Port)" -ForegroundColor Green
}

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "       FINCORE DIGITAL BANKING PLATFORM - RUNNER (Team-A + Team-D)" -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

# === TEAM A - Core Banking ===
$teamAServices = @(
    @{ Name = "API Gateway";            Path = (Join-Path $BackendDir "api-gateway");           Port = 8080; Cmd = "mvn spring-boot:run" },
    @{ Name = "Customer Service";       Path = (Join-Path $BackendDir "customer-service");      Port = 8081; Cmd = "mvn spring-boot:run" },
    @{ Name = "Account Service";        Path = (Join-Path $BackendDir "account-service");       Port = 8082; Cmd = "mvn spring-boot:run" },
    @{ Name = "Transaction Service";    Path = (Join-Path $BackendDir "transaction-service");   Port = 8083; Cmd = "mvn spring-boot:run" },
    @{ Name = "Dashboard Service";      Path = (Join-Path $BackendDir "dashboard-service");     Port = 8084; Cmd = "mvn spring-boot:run" },
    @{ Name = "Loan Service";           Path = (Join-Path $BackendDir "loan-service");          Port = 8085; Cmd = "mvn spring-boot:run" },
    @{ Name = "Beneficiary Service";    Path = (Join-Path $BackendDir "beneficiary-service");   Port = 8086; Cmd = "mvn spring-boot:run" },
    @{ Name = "Payment Service";        Path = (Join-Path $BackendDir "payment-service");       Port = 8087; Cmd = "mvn spring-boot:run" },
    @{ Name = "IMPS/NEFT/UPI Service";  Path = (Join-Path $BackendDir "imps-neft-upi-service"); Port = 8088; Cmd = "mvn spring-boot:run" },
    @{ Name = "KYC Service";            Path = (Join-Path $BackendDir "kyc-service");           Port = 8089; Cmd = "mvn spring-boot:run" },
    @{ Name = "Face Match Service";     Path = (Join-Path $BackendDir "face-match-service");    Port = 8090; Cmd = "mvn spring-boot:run" }
)

# === TEAM D - Risk, Compliance & Audit ===
$teamDServices = @(
    @{ Name = "Risk Scoring Service";   Path = (Join-Path $RootDir "risk-scoring-service");              Port = 8091; Cmd = "mvn spring-boot:run" },
    @{ Name = "Compliance Service";     Path = (Join-Path $RootDir "complianceservice");                 Port = 8092; Cmd = "mvn spring-boot:run" },
    @{ Name = "Notification Service";   Path = (Join-Path $RootDir "notification-service");              Port = 8093; Cmd = "mvn spring-boot:run" },
    @{ Name = "Disbursement Saga";      Path = (Join-Path $RootDir "disbursement-saga");                 Port = 8094; Cmd = "mvn spring-boot:run" },
    @{ Name = "Settlement Service";     Path = (Join-Path $RootDir "settlement-confirmation-service");   Port = 8095; Cmd = "mvn spring-boot:run" },
    @{ Name = "Audit Trail Service";    Path = (Join-Path $RootDir "audittrail");                        Port = 8096; Cmd = "mvn spring-boot:run" }
)

Write-Host "`n[1/4] Launching Team A (Core Banking) Microservices..." -ForegroundColor Yellow
foreach ($svc in $teamAServices) {
    Start-ServiceWindow -Name $svc.Name -Path $svc.Path -Port $svc.Port -Command $svc.Cmd
    Start-Sleep -Milliseconds 800
}

Write-Host "`n[2/4] Launching Angular 18 Frontend UI..." -ForegroundColor Yellow
Start-ServiceWindow -Name "Angular Frontend UI" -Path $FrontendDir -Port 4200 -Command "npm start"

Write-Host "`n[3/4] Launching Team D (Risk, Compliance & Audit) Microservices..." -ForegroundColor Yellow
foreach ($svc in $teamDServices) {
    Start-ServiceWindow -Name $svc.Name -Path $svc.Path -Port $svc.Port -Command $svc.Cmd
    Start-Sleep -Milliseconds 800
}

Write-Host "`n[4/4] All 18 services launched in dedicated interactive terminals!" -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "  Frontend UI          : http://localhost:4200" -ForegroundColor White
Write-Host "  API Gateway          : http://localhost:8080" -ForegroundColor White
Write-Host "  Gateway Health       : http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host "  ---- Team D Services ----" -ForegroundColor White
Write-Host "  Risk Scoring         : http://localhost:8091/api/v1/risk" -ForegroundColor White
Write-Host "  Compliance           : http://localhost:8092/api/v1/compliance" -ForegroundColor White
Write-Host "  Notifications        : http://localhost:8093/api/v1/notifications" -ForegroundColor White
Write-Host "  Disbursement Saga    : http://localhost:8094/api/v1/disbursement-sagas" -ForegroundColor White
Write-Host "  Settlement           : http://localhost:8095/api/v1/settlements" -ForegroundColor White
Write-Host "  Audit Trail          : http://localhost:8096/api/v1/audit" -ForegroundColor White
Write-Host "==========================================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 5
Start-Process "http://localhost:4200"
