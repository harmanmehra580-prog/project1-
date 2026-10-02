from django.shortcuts import render 
from .models import Project
def portfolio_index(request):
    projects = Project.object.all()
    context={'projects':projects
                 }
    return render(request,'projects/index.html',context)
   