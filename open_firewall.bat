@echo off
REM Скрипт для открытия порта 5173 в Windows Firewall
REM Запустите этот файл с правами администратора

echo Открываю порт 5173 в Windows Firewall...

netsh advfirewall firewall add rule name="EduPlay Dev Server Port 5173" dir=in action=allow protocol=tcp localport=5173 profile=any

echo Готово! Теперь можете подключиться с мобильного устройства по адресу:
echo http://192.168.100.7:5173/

pause
