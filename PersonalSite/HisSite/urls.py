from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("home/", views.home_page, name="home"),
    path("about/", views.about_page, name="about"),
    path("projects/", views.projects_page, name="projects"),
    path("links/", views.links_page, name="links"),
    # path("sendMessage/", views.sendMessage, name="sendMessage"),
    # path("viewMessage/", views.viewMessage, name="viewMessage"),

    path('api/home/', views.home_content, name='home_content'),
    path('api/about/', views.about_content, name='about_content'),
    path('api/projects/', views.projects_content, name='projects_content'),
    path('api/links/', views.links_content, name='links_content'),
]
