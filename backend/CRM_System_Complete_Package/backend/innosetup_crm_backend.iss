[Setup]
AppName=CRM Backend
AppVersion=1.0
DefaultDirName={userpf}\CRM Backend
DefaultGroupName=CRM Backend
UninstallDisplayIcon={app}\run_backend.bat
OutputDir=.
OutputBaseFilename=CRM-Backend-Setup

[Files]
Source: "*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\Iniciar Backend CRM"; Filename: "{app}\run_backend.bat"
Name: "{userdesktop}\Iniciar Backend CRM"; Filename: "{app}\run_backend.bat" 