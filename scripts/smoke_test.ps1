# Smoke test for deployed app
# - Registers a unique test user
# - Calls /api/me using the same WebRequestSession to verify the cookie-based session

$url = 'https://emoji-web-app.vercel.app'
$ts = [int][double]::Parse((Get-Date -UFormat %s))
$email = "smoke+$ts@example.com"
$password = "P@ssw0rd!$ts"

Write-Host "Using test account: $email"

$jar = New-Object Microsoft.PowerShell.Commands.WebRequestSession

try {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    Write-Host "POST $url/api/auth/register"
    $resp = Invoke-RestMethod -Uri ($url + '/api/auth/register') -Method Post -Body $body -ContentType 'application/json' -WebSession $jar -ErrorAction Stop
    Write-Host "Register response status: OK"
    Write-Host ($resp | ConvertTo-Json -Compress)
} catch {
    Write-Host "Register failed:`n$($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        Write-Host "Response body:`n$text"
    }
    exit 1
}

Start-Sleep -Milliseconds 500

try {
    Write-Host "GET $url/api/me"
    $me = Invoke-RestMethod -Uri ($url + '/api/me') -Method Get -WebSession $jar -ErrorAction Stop
    Write-Host "/api/me response:"
    Write-Host ($me | ConvertTo-Json -Compress)
    exit 0
} catch {
    Write-Host "/api/me call failed:`n$($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        Write-Host "Response body:`n$text"
    }
    exit 1
}
