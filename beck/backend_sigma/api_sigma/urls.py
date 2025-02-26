from django.urls import path
from .views import register, login
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register, name='register'), # Роутер на рєстрацію
     path('login/', login, name='login'), 

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Отримання JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Оновлення JWT
]