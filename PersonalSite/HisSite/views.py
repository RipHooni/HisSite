from django.shortcuts import render

def index(request):
    """Serves the full page"""
    return render(request, 'index.html', {'initial_content': 'home'})

def home(request):
    """If accessed directly, serve full page. Otherwise just content."""
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or 'HX-Request' in request.headers:
        # AJAX request - return just content
        return render(request, 'index.html')
    else:
        # Direct access - return full page with about content
        return render(request, 'index.html', {'initial_content': 'index'})

def about(request):
    """If accessed directly, serve full page. Otherwise just content."""
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or 'HX-Request' in request.headers:
        # AJAX request - return just content
        return render(request, 'about.html')
    else:
        # Direct access - return full page with about content
        return render(request, 'index.html', {'initial_content': 'about'})

def projects(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or 'HX-Request' in request.headers:
        return render(request, 'projects.html')
    else:
        return render(request, 'index.html', {'initial_content': 'projects'})

def links(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or 'HX-Request' in request.headers:
        return render(request, 'links.html')
    else:
        return render(request, 'index.html', {'initial_content': 'links'})

# def sendMessage(request):
    # return HttpResponse("Send Him a message")

# def viewMessage(request):
    # return HttpResponse("View His messages")