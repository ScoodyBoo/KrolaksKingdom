@echo off
:: Open Windows Terminal with server as the main pane and client as a vertical split

wt -w 0 ^
    --title "Server" cmd /k "title Server && cd /d C:\Users\tullm\Desktop\krolaks-kingdom\src\server && python run_server.py" ^
    ; split-pane -V --title "" ^
    cmd /k "title KK:Server\Client && cd /d C:\Users\tullm\Desktop\krolaks-kingdom\src\client && python run_client.py"
