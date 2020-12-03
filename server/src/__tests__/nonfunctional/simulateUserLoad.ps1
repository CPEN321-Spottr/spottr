$n_users = 1000

$frequency = 5
$duration = 2

$n_actors = $n_users/$frequency

$actors = 1..$n_actors

$jobs = @()

$calls = 0
$failures = 0

ForEach($actor in $actors) {
  $jobs += Start-Job -Scriptblock {. ./simulateUserActions.ps1 -frequency 5 -duration 2 -stddev 0.125}
}

ForEach($job in $jobs) {
  $data = $job | Wait-Job | Receive-Job

  $calls += $data.calls
  $failures += $data.failures
}

Write-Output "-------------------------------------------------";
Write-Output "Simultaneous Users Simulated: $($n_users)"
Write-Output "Total Interactions: $($calls)"
Write-Output "Total Failed Interactions: $($failures)"
Write-Output "Failure Rate: $($failures/$calls*100)%"
Write-Output "-------------------------------------------------";
