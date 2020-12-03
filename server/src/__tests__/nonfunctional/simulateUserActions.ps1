param (
    [Parameter(Mandatory=$true)] [double] $frequency,
    [Parameter(Mandatory=$true)] [double] $duration,
    [Parameter()] [double] $stddev = 1
)

$start = Get-Date
$id = New-Guid

$baseURL = "https://spottr-be.herokuapp.com"

$endpoint_types = @("GET")

$GET_endpoints = @(
  "$($baseURL)/users",
  "$($baseURL)/users/46",
  "$($baseURL)/workout/history?entries=10",
  "$($baseURL)/workout/plan/2464",
  "$($baseURL)/workout/muscle-groups",
  "$($baseURL)/users/46/workout/one-up/2464"
)
$PUT_endpoints = @("$($baseURL)/users/46/workout/change-difficulty?factor=-1&target-muscle-group=1", "$($baseURL)/users/46/workout/change-difficulty?factor=1&target-muscle-group=1")

Write-Output "Started User Simulation: $($id)"

$current = Get-Date

$calls = 0
$failures = 0

while((New-TimeSpan -Start $start -End $current).TotalSeconds -lt $duration) {
  [double]$u1 = Get-Random -Minimum 0.0 -Maximum 1.0
  [double]$u2 = Get-Random -Minimum 0.0 -Maximum 1.0

  [double]$randStdNormal = [math]::Sqrt(-2.0 * [math]::Log($u1)) * [math]::Sin(2.0 * [math]::PI * $u2)
  [double]$randNormalFreq = $frequency + $stddev * $randStdNormal

  $callstart = Get-Date

  $endpoint_type = Get-Random -InputObject $endpoint_types

  Switch ($endpoint_type)
  {
      "GET" { $endpoint = Get-Random -InputObject $GET_endpoints}

      "PUT" { $endpoint = Get-Random -InputObject $PUT_endpoints}
  }

  try {
    $calls += 1
    $response = Invoke-RestMethod -Uri $endpoint -Method $endpoint_type
  } catch {
    Write-Host $_
    $failures += 1
  }

  $callend = Get-Date

  $randNormalSleep = 1/$randNormalFreq - (New-TimeSpan -Start $callstart -End $callend).TotalSeconds

  if($randNormalSleep -gt 0) {
    sleep $randNormalSleep
  }

  $current = Get-Date
}

return [pscustomobject]@{
  calls = $calls
  failures = $failures
}
