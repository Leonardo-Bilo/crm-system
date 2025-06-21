[Setup]
AppName=CRM System
AppVersion=1.0
DefaultDirName={userpf}\CRM System
DefaultGroupName=CRM System
UninstallDisplayIcon={app}\iniciar_crm.bat
OutputDir=.
OutputBaseFilename=CRM-System-Setup

[Files]
Source: "src\*"; DestDir: "{app}\backend\src"; Flags: recursesubdirs
Source: "requirements.txt"; DestDir: "{app}\backend"
Source: "alembic.ini"; DestDir: "{app}\backend"
Source: "migrations\*"; DestDir: "{app}\backend\migrations"; Flags: recursesubdirs
Source: "run_backend.bat"; DestDir: "{app}"
Source: "iniciar_crm.bat"; DestDir: "{app}"
Source: "frontend\CRM System_0.1.0_x64-setup.exe"; DestDir: "{app}\frontend"

[Run]
Filename: "{app}\frontend\CRM System_0.1.0_x64-setup.exe"; Description: "Instalar o CRM Desktop"; Flags: nowait postinstall skipifsilent

[Icons]
Name: "{group}\CRM System"; Filename: "{app}\iniciar_crm.bat"
Name: "{userdesktop}\CRM System"; Filename: "{app}\iniciar_crm.bat" 