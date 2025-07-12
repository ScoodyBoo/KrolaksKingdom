from livereload import Server

server = Server()
##server.watch('client.html')
server.watch('client.html')
server.serve(
    root='.',         
    port=5500, 
    liveport=None, 
    host=None, 
    debug=None,
    open_url=False, 
    restart_delay=2, 
    live_css=True, 
    default_filename='client.html',
               
    open_url_delay=1)