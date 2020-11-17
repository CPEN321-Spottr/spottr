$n_users = 50

$users = 1..$n_users

$jobs = @()

$calls = 0
$failures = 0

ForEach($user in $users) {
  $jobs += Start-Job -Scriptblock {. ./simulateUserActions.ps1 -frequency 5 -duration 2 -stddev 0.125}
}

ForEach($job in $jobs) {
  $data = $job | Wait-Job | Receive-Job

  $calls += $data.calls
  $failures += $data.failures
}

Write-Host
Write-Host "-------------------------------------------------";
Write-Host "Simultaneous Users Simulated: $($n_users)"
Write-Host "Total Interactions: $($calls)"
Write-Host "Total Failed Interactions: $($failures)"
Write-Host "Failure Rate: $($failures/$calls*100)%"
Write-Host "-------------------------------------------------";
Write-Host
