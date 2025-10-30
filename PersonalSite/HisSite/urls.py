from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("projects/", views.projects, name="projects"),
    path("links/", views.links, name="links"),
    # path("sendMessage/", views.sendMessage, name="sendMessage"),
    # path("viewMessage/", views.viewMessage, name="viewMessage"),
]