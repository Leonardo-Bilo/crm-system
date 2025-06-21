@echo off
echo Iniciando iniciar_crm.bat... > log_backend.txt
REM Garante que está na pasta do script
cd /d %~dp0
REM Inicia o backend Flask em modo oculto
start "" /min run_backend.bat
REM Aguarda mais tempo para garantir que o backend subiu
ping 127.0.0.1 -n 30 >nul
REM Inicia o frontend (caminho corrigido)
start "" "C:\Users\LEONA\AppData\Local\CRM System\app.exe"
echo iniciar_crm.bat finalizado >> log_backend.txt
 