from livereload import Server

server = Server()
##server.watch('client.html')
server.watch('index.html')
server.watch('css')
server.watch('html/game_view.html')
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