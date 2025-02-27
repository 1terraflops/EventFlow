from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,  permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer
from .models import EventRegistration

@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Заповніть всі поля"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Такий користувач вже існує"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Заповніть всі поля"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)  # Перевіряє пароль

    if user is None:
        return Response({"error": "Невірний логін або пароль"}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    })


# Створення івенту (тільки адміністратор або організатор)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    # Перевірка: чи є користувач організатором (is_staff) або суперкористувачем (is_superuser)
    if not request.user.is_staff and not request.user.is_superuser: 
        return Response({"error": "У вас немає прав створювати івенти"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data["created_by"] = request.user.id  # Передаємо ID авторизованого юзера, той котрий створює.

    # Використовуємо серіалізатор для перевірки та створення івенту.
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Отримати список івентів
@api_view(["GET"])
def event_list(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

# Отримати один івент
@api_view(["GET"])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Івент не знайдено"}, status=status.HTTP_404_NOT_FOUND)

# Реєстрація на івент
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_for_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Івент не знайдено"}, status=status.HTTP_404_NOT_FOUND)

    email = request.data.get("email")
    if not email:
        return Response({"error": "Вкажіть email"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Перевірка, чи користувач вже зареєстрований на цей івент
    if EventRegistration.objects.filter(event=event, user=request.user).exists():
        return Response({"error": "Ви вже зареєстровані на цей івент"}, status=status.HTTP_400_BAD_REQUEST)

    registration = EventRegistration.objects.create(event=event, user=request.user, email=email)

    # 📩 Відправка email
    send_mail(
        subject=f"Реєстрація на {event.title}",
        message=f"Ви зареєструвались на івент {event.title}, який відбудеться {event.start_date}.",
        from_email="noreply.sigma@xcdto.xyz",
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({"message": "Ви успішно зареєстровані!", "registration_id": registration.id})

# Хто зарєестрований на івент
@api_view(['GET'])
def get_registered_users(request, event_id):
    # Фільтруємо реєстрації за івентом
    registrations = EventRegistration.objects.filter(event_id=event_id)

    # Створюємо список з ID користувачів та іншої інформації
    data = [
        {
            'user_id': registration.user.id,  # ID користувача
            'registered_at': registration.registered_at  # Час реєстрації
        }
        for registration in registrations
    ]

    return Response(data)

# Отримати інформацію про користувача
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Користувача не знайдено"}, status=status.HTTP_404_NOT_FOUND)

    # Формуємо відповідь з потрібними даними
    data = {
        'user_id': user.id,
        'username': user.username,
        #'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_active': user.is_active,
        'is_staff': user.is_staff,
        'date_joined': user.date_joined,
        #'last_login': user.last_login
    }

    return Response(data)

