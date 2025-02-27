from django.urls import path
from .views import register, login, create_event, event_list, event_detail, register_for_event, get_registered_users, get_user_info
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register, name='register'), # Роутер на рєстрацію
    path('login/', login, name='login'), 

    path("events/", event_list, name="event-list"),
    path("events/create/", create_event, name="create-event"),
    path("events/<int:event_id>/", event_detail, name="event-detail"),
    path("events/<int:event_id>/register/", register_for_event, name="register-event"),
    path("events/<int:event_id>/get-register/", get_registered_users, name="get-register-event"),

    path("user/<int:user_id>/", get_user_info, name="get-user-info"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Отримання JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Оновлення JWT
]