from django.urls import path
from .views import (
    register, login, create_event, event_list, event_detail, 
    register_for_event, get_registered_users, get_user_info,
    active_event_list, archived_event_list, search_events, 
    update_user_profile, update_event,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Автентифікація
    path('register/', register, name='register'),
    path('login/', login, name='login'), 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Івенти
    path("events/", event_list, name="event-list"),
    path("events/active/", active_event_list, name="active-event-list"),
    path("events/archived/", archived_event_list, name="archived-event-list"),
    path("events/search/", search_events, name="search-events"),
    path("events/create/", create_event, name="create-event"),
    path("events/<int:event_id>/", event_detail, name="event-detail"),
    path("events/<int:event_id>/update/", update_event, name="update-event"),
    
    # Реєстрація на івенти
    path("events/<int:event_id>/register/", register_for_event, name="register-event"),
    path("events/<int:event_id>/registrations/", get_registered_users, name="get-register-event"),
    
    # Користувачі
    path("users/<int:user_id>/", get_user_info, name="get-user-info"),
    path("users/<int:user_id>/update_profile/", update_user_profile, name="update-user-profile"),
]