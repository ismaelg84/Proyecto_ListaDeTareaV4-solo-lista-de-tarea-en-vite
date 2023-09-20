from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from .serializer import TaskSerializer
from .models import Task

# Create your views here.
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    def get_queryset(self):
        user = self.request.user  # Obtener el usuario conectado
        return Task.objects.filter( idUsuario=user)
    
class TaskListAPIView(ListAPIView): #mostrar los trabajos que pertenecen a un usuario específico cuando se realice una solicitud GET a la ruta
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user  # Obtener el usuario conectado
        return Task.objects.filter( idUsuario=user)

class UserTasksView(APIView): #mostrar los trabajos que pertenecen a un usuario específico cuando se realice una solicitud GET a la ruta 
    def get(self, request, user_id):
        try:
            tasks = Task.objects.filter(idUsuario=user_id)
            serializer = TaskSerializer(tasks, many=True)
            
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)