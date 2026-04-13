$RuleName = "EduPlay - Port 5173"
$Port = 5173

# Проверяю если правило уже существует
$existingRule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "Правило уже существует! Удаляю..."
    Remove-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
}

# Создаю новое правило
Write-Host "Создаю правило Firewall для EduPlay..."
New-NetFirewallRule -DisplayName $RuleName `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort $Port `
    -Profile Any `
    -Enabled True

Write-Host "✓ Правило создано успешно!"
Write-Host ""
Write-Host "Теперь на iPhone откройте Safari и введите:"
Write-Host "http://192.168.100.7:5173/"
Write-Host ""
Write-Host "Убедитесь что оба устройства в одной WiFi сети!"
