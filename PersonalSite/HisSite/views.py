from django.shortcuts import render, redirect

def index(request):
    """Redirects to the home page"""
    return redirect('home')

def home_page(request):
    """Full page with home content"""
    return render(request, 'index.html', {'initial_content': 'home'})

def about_page(request):
    """Full page with about content"""
    return render(request, 'index.html', {'initial_content': 'about'})

def projects_page(request):
    """Full page with projects content"""
    return render(request, 'index.html', {'initial_content': 'projects'})

def links_page(request):
    """Full page with links content"""
    return render(request, 'index.html', {'initial_content': 'links'})

def home_content(request):
    """Just the home content HTML"""
    return render(request, 'home.html')

def about_content(request):
    """Just the about content HTML"""
    return render(request, 'about.html')

def projects_content(request):
    """Just the projects content HTML"""
    return render(request, 'projects.html')

def links_content(request):
    """Just the links content HTML"""
    return render(request, 'links.html')