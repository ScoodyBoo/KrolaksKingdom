from livereload import Server

server = Server()
##server.watch('client.html')
server.watch('index.html')
server.watch('css/global_styles.css')
server.watch('html/game_view.html')
server.watch('html/login.html')
server.watch('html/register.html')




server.watch('js/auth_handler.js')
server.watch('js/content_loader.js')
server.watch('js/game_handler.js')
server.watch('js/global_scripts.js')
server.watch('js/websocket_handler.js')


server.serve(
    root='.',         
    port=5500, 
    liveport=None, 
    host=None, 
    debug=None,
    open_url=False, 
    restart_delay=2, 
    live_css=True, 
    default_filename='index.html',
               
    open_url_delay=1)