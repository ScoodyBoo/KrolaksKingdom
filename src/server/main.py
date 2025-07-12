import os, sys
import asyncio
import websockets
import json
import random
from dotenv import load_dotenv
load_dotenv()


#||> System Functions
def clear_screen():
    os.system('cls')


clear_screen()



#||> ServerSide Authentification
class UserProfile():
    def __init__(self, email:str, password:str):
        self.email:str = email
        self.password:str = password
        self.online_status:bool = False
        self.secret_key:str = ""
        
    def SetOnline(self,state:bool):
        self.online_status = state
    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password,
            "online_status": self.online_status,
            "secret_key": self.secret_key
        }

    @staticmethod
    def from_dict(data: dict):
        profile = UserProfile(data["email"], data["password"])
        profile.online_status = data.get("online_status", False)
        profile.secret_key = data.get("secret_key", "")
        return profile
database:dict[str,UserProfile] = {}

def CheckUserExists(username:str):
    if username in database.keys():
        return True
    return False
def CheckUserOnline(username:str):
    if database[username].online_status == True:
        return True
    return False  
def AddUser(username:str, email:str, password:str):
    global database
    database[username] = UserProfile(email, password)

def LogoutAllUsers():
    for username in database.keys():
        database[username].SetOnline(False)

#||> Database
database_local_folder_path = "database_savedata"
database_filename = "db_data.json"
database_fullpath = f"{database_local_folder_path}/{database_filename}"
os.makedirs(database_local_folder_path, exist_ok=True)

def load_database():
    global database
    if os.path.exists(database_fullpath):
        with open(database_fullpath, "r", encoding="utf-8") as f:
            data = json.load(f)
            database = {k: UserProfile.from_dict(v) for k, v in data.items()}
            print(f"Database loaded from file -> {database_filename}")

def save_database():
    with open(database_fullpath, "w", encoding="utf-8") as f:
        json.dump({k: v.to_dict() for k, v in database.items()}, f, indent=4)
        print(f"Database saved to file -> {database_filename}")

load_database()
LogoutAllUsers()
# save_database()



#||> Passcode Gen
auth_codes:list[str] = [
	"lobster", "chicken", "wise", "green", "turkey", "wander", "space", "tennessee",
	"shadow", "eagle", "hunter", "zombie", "phantom", "vortex", "nebula", "delta",
	"python", "rogue", "scarlet", "ember", "nova", "storm", "falcon", "onyx"
]
auth_fuzz:list[str] = [
    "$", "@", "!", "?", "&", "~", "+","R", "S", "W", "X", "Z", "K", "Y", "Q", "B", "L", "7", "9"]
def GenerateAuthentificationPassphrase() -> str:
	code_key:str = random.choice(auth_codes)+"-"+random.choice(auth_codes)+"-"+str(random.randint(11111,99999))
	code_str = ""
	for char in code_key:
     
		charChange:int = random.randint(0, 100)
		if charChange > 66 and char != "-":
			code_str += random.choice(auth_fuzz)
		else:
			code_str += char
   
	print(f"Generated: Original: {code_key}   || Hash: {code_str}" )
	return code_str



#||> Email Service
from mailersend import emails
api_key:str | None = os.getenv("MAILERSEND_API_KEY")
def SendUserAuthentificationEmail(email:str, username:str):
    global database

    #Store 'secret key' so if you get hacked you dont lose ur password
    database[username].secret_key = GenerateAuthentificationPassphrase()
    mailer = emails.NewEmail(api_key)
    mail_body = {}
    mail_from = {"name": "Krolaks Kingdom - Signup Messenger", "email": "test@test-nrw7gym1peng2k8e.mlsender.net"}
    recipients = [{"name": username,"email": email}]
    reply_to = [{"name": "Krolaks Kingdom - Messenger", "email": "test-nrw7gym1peng2k8e.mlsender.net"}]

    mailer.set_mail_from(mail_from, mail_body)
    mailer.set_mail_to(recipients, mail_body)
    mailer.set_subject(f"Krolaks Kingdom Singup! - Welcome {username}!", mail_body)
    mailer.set_html_content(f"""<h2>Thank you for signing up for Krolaks Kingdom!<h2> <br><hr>
                            The game is in early tech alpha, everything is subject to change and bugs are to be expected!  <br>
                            Please report bugs <a href="https://www.youtube.com/watch?v=QKA5EUdXkqw&list=RDQKA5EUdXkqw&start_radio=1"> Bug Report Here! </a>! <br>
                            Here is your secret key to login! dont lose it! username: {username}  login-code: {database[username].secret_key} <br>
                            ( take this key and place it... someplace safe! ) - dont shoot the messenger! """, mail_body)
    mailer.set_plaintext_content("This is the text content", mail_body)
    mailer.set_reply_to(reply_to, mail_body)

    # using print() will also return status code and data
    
    result = mailer.send(mail_body)
    if result == 202:
        print(f"Sent authentification email to {username} - {email}")








#||> Websok Server Implementation
connected_clients = set()

def parse_signal():
    pass
def print_connected_users():
    print(f"registered_users {database.keys()}")
    print(f"connected_soks {connected_clients}")

async def handle_connections(websocket):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            #|> On Message Recieved
            #print(f"Raw message: {message}")
            
            #|> Is Message Json
            try:
                data = json.loads(message)
                #print(f"JSON received: {data}")

                # Handle Authentification
                if data.get("type") == "register":      # Register New
                    username = data.get("username")
                    email = data.get("email")
                    password = data.get("password")
                    
                    if CheckUserExists(username):
                        await websocket.send("user already exists!")
                        print(f"-{username} tried to signup!")
                    else:
                        AddUser(username,email,password)
                        SendUserAuthentificationEmail(email, username)
                        print(f"-{username} just signed up!")
                        await websocket.send("signup success. check email")
                        save_database()                        
                if data.get("type") == "login":      # Login Existing
                    username = data.get("username")
                    password = data.get("password")
                    
                    if CheckUserExists(username):
                        if CheckUserOnline(username):
                            await websocket.send("user already online!")
                        else:        
                            await websocket.send(f"logged in {username}!")
                            print(f"Logged in {username}")
                            database[username].SetOnline(True)
                        
                    else:
                        await websocket.send("user doesnt exist!")
                        print(f"{username} tried to login but doesnt exist!")
                        

                elif data.get("type") == "get_users":
                    user_data = {
                        u: {
                            "email": p.email,
                            "password": p.password,
                            "secret_key": p.secret_key,
                            "online_status": p.online_status
                        } for u, p in database.items()
                    }
                    await websocket.send(json.dumps({"type": "user_list", "users": user_data}))

                elif data.get("type") == "update_user":
                    username = data.get("username")
                    if CheckUserExists(username):
                        user = database[username]
                        user.email = data.get("email")
                        user.password = data.get("password")
                        user.secret_key = data.get("secret_key")
                        user.online_status = data.get("online_status")
                        save_database()
                        await websocket.send(f"user {username} updated!")
                    else:
                        await websocket.send("user not found")


             
            
            #|> If Not Json
            except json.JSONDecodeError:
                await websocket.send("Invalid JSON.")
    
    #| On Crash, Exit, Disconnect
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        connected_clients.remove(websocket)

async def main():
    port = int(p) if (p := os.getenv("PORT")) else 8453 #| Dev Port
    ip = str(p) if (p := os.getenv("IP")) else "localhost" #| Local IP

    
    async with websockets.serve(handle_connections, ip, port):
        print(f"KK Server Started on ws://{ip}:{port}")
        await asyncio.Future()  # Keep running
    
asyncio.run(main())

