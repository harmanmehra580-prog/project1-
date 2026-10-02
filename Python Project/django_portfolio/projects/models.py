from django.db import models

class Project(models.Model): 
    title = models.CharField(max_length=100) 
    description = models.TextField() 
    technology = models.CharField(max_length=50) # e.g., "Python, React" 
    image = models.ImageField(upload_to='project_images/') 
    github_link = models.URLField(blank=True) 
    def __str__(self): 
        return self.title 