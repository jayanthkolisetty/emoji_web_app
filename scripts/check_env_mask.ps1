$m = Select-String -Path .env.local -Pattern '^SUPABASE_SERVICE_ROLE_KEY=' -ErrorAction SilentlyContinue
if ($m) {
  $line = $m.Line
  $parts = $line -split '='
  $val = $parts[1]
  $mask = '*' * [Math]::Min($val.Length,8)
  Write-Host "SUPABASE_SERVICE_ROLE_KEY=$mask (masked)"
} else {
  Write-Host "SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
}
