$attempts = 1000

$baseURL = "https://spottr-be.herokuapp.com"

$userID = 6
$workoutLength = 40
$targetGroup = 1

$uri = "$($baseURL)/users/$($userID)/workout/generate-plan/$($workoutLength)&$($targetGroup)"

$times = @()

for ($i = 0; $i -lt $attempts; $i++) {
  $start = Get-Date
  try {
    $response = Invoke-RestMethod -Uri $uri -Method GET
  } catch {

  }
  $end = Get-Date

  $duration = (New-TimeSpan -Start $start -End $end).TotalSeconds

  $times += $duration
}

$measure = $times | Measure-Object -AllStats

Write-Host
Write-Host "-------------------------------------------------";
Write-Host "Testing Endpoint: $($uri)"
Write-Host "-------------------------------------------------";
Write-Host "Total Calls: $($measure.Count)";
Write-Host "Maximum Call Duration: $($measure.Maximum) seconds";
Write-Host "Average Call Duration: $($measure.Average) seconds";
Write-Host "Standard Deviation: $($measure.StandardDeviation)";
Write-Host "-------------------------------------------------";
Write-Host
