import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

WATCHED_FILE = "main.py"
SERVER_COMMAND = ["python", "main.py"]

class ServerReloader(FileSystemEventHandler):
    def __init__(self):
        self.process = subprocess.Popen(SERVER_COMMAND)

    def restart_server(self):
        print("🔁 Restarting server...")
        self.process.terminate()
        self.process.wait()
        self.process = subprocess.Popen(SERVER_COMMAND)

    def on_modified(self, event):
        if event.src_path.endswith(WATCHED_FILE):
            self.restart_server()

    def stop(self):
        self.process.terminate()
        self.process.wait()

if __name__ == "__main__":
    path = "."
    event_handler = ServerReloader()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        event_handler.stop()

    observer.join()
