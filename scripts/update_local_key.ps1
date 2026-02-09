# Securely prompt for SUPABASE_SERVICE_ROLE_KEY and update .env.local
$secure = Read-Host 'Enter SUPABASE_SERVICE_ROLE_KEY (input hidden)' -AsSecureString
$key = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
if (-not (Test-Path .env.local)) { New-Item -Path .env.local -ItemType File | Out-Null }
$content = Get-Content .env.local -Raw
if ($content -match '^SUPABASE_SERVICE_ROLE_KEY=') {
    $content = ($content -replace '^(SUPABASE_SERVICE_ROLE_KEY=).*', "`$1$key")
    Set-Content .env.local -Value $content
} else {
    Add-Content -Path .env.local -Value "SUPABASE_SERVICE_ROLE_KEY=$key"
}
# Clear sensitive variables from memory
$key = $null
$secure = $null
Write-Host '.env.local updated (do not commit this file).'
