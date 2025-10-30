from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "index.html")

def about(request):
    return render(request, "about.html")

def projects(request):
    return render(request, "projects.html")

def links(request):
    return render(request, "links.html")

# def sendMessage(request):
    # return HttpResponse("Send Him a message")

# def viewMessage(request):
    # return HttpResponse("View His messages")