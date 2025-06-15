param(
    [string]$Registry = "songminkyu",
    [string]$Tag = "latest"
)

$services = @("gateway", "notification", "order", "payment", "product", "user")

Write-Host "=== Docker Build and Push Script ===" -ForegroundColor Cyan
Write-Host "Registry: $Registry" -ForegroundColor White
Write-Host "Tag: $Tag" -ForegroundColor White
Write-Host "Services: $($services -join ', ')" -ForegroundColor White
Write-Host ""

# Docker login check
Write-Host "Checking Docker Hub login status..." -ForegroundColor Yellow
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Build and Push phase (combined)
Write-Host "Starting Docker build and push..." -ForegroundColor Green
$startTime = Get-Date

foreach ($service in $services) {
    $imageTag = "$Registry/fc-nestjs-$service`:$Tag"
    Write-Host "[$($services.IndexOf($service) + 1)/$($services.Count)] Building and pushing: $imageTag" -ForegroundColor Yellow
    
    $operationTime = Measure-Command {
        # buildx build with --push option (build and push in one command)
        $process = Start-Process -FilePath "docker" -ArgumentList "buildx", "build", "--platform", "linux/amd64", "-t", $imageTag, "-f", "./apps/$service/Dockerfile", "--target", "production", ".", "--push" -Wait -PassThru -NoNewWindow
        $global:LASTEXITCODE = $process.ExitCode
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build and push completed: $service (Time: $($operationTime.Minutes)m $($operationTime.Seconds)s)" -ForegroundColor Green
    } else {
        Write-Host "Build and push failed: $service" -ForegroundColor Red
        exit 1
    }
}

$endTime = Get-Date
$totalTime = $endTime - $startTime

Write-Host ""
Write-Host "=== Task Completed ===" -ForegroundColor Cyan
Write-Host "Total time: $($totalTime.Minutes)m $($totalTime.Seconds)s" -ForegroundColor White
Write-Host "All images built and pushed successfully!" -ForegroundColor Green