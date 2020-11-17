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

Write-Output
Write-Output "-------------------------------------------------";
Write-Output "Testing Endpoint: $($uri)"
Write-Output "-------------------------------------------------";
Write-Output "Total Calls: $($measure.Count)";
Write-Output "Maximum Call Duration: $($measure.Maximum) seconds";
Write-Output "Average Call Duration: $($measure.Average) seconds";
Write-Output "Standard Deviation: $($measure.StandardDeviation)";
Write-Output "-------------------------------------------------";
Write-Output
