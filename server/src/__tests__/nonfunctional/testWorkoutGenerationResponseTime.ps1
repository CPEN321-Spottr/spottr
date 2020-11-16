$baseURL = "https://spottr-be.herokuapp.com"

$userID = 6
$workoutLength = 40
$targetGroup = "Arms"

$uri = "$($baseURL)/users/$($userID)/workout/generate-plan/$($workoutLength)&$($targetGroup)"

Write-Host $uri

$StartTime = $(get-date)
$response = Invoke-WebRequest -uri $uri -Method "GET"
Write-Host ("{0}" -f ($(get-date)-$StartTime))

Write-Host $response
