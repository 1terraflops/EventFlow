from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer, UserUpdateSerializer

@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Заповніть всі поля"}, status=status.HTTP_400_BAD_REQUEST)

    # Перевірка чи username є валідною електронною поштою
    try:
        validate_email(username)
    except ValidationError:
        return Response({"error": "Логін повинен бути валідною електронною поштою"}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Такий користувач вже існує"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=username,  last_login = timezone.now())
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
    
    # Перевірка чи username є валідною електронною поштою
    try:
        validate_email(username)
    except ValidationError:
        return Response({"error": "Логін повинен бути валідною електронною поштою"}, 
                        status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Невірний логін або пароль"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Оновлення поля last_login
    user.last_login = timezone.now()
    user.save()

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

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)  # Знаходимо івент за ID
    except Event.DoesNotExist:
        return Response({"error": "Івент не знайдено"}, status=status.HTTP_404_NOT_FOUND)

    # Перевірка прав доступу: тільки адміністратор або автор івенту може його редагувати
    if not (request.user.is_staff or request.user.is_superuser or event.created_by == request.user):
        return Response({"error": "У вас немає прав для редагування цього івенту"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data

    # Оновлення полів івенту (якщо вони передані)
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'start_date' in data:
        event.start_date = data['start_date']
    if 'end_date' in data:
        event.end_date = data['end_date']

    # Зберігаємо зміни
    event.save()

    # Повертаємо оновлений івент
    serializer = EventSerializer(event)
    return Response(serializer.data)

# Отримати список івентів з можливістю фільтрації
@api_view(["GET"])
def event_list(request):
    # Параметр для включення архівних івентів
    show_archived = request.GET.get('archived', 'false').lower() == 'true'
    
    current_time = timezone.now()
    
    if show_archived:
        # Показувати всі івенти
        events = Event.objects.all()
    else:
        # Показувати тільки активні івенти
        events = Event.objects.filter(end_date__gt=current_time)
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

# Отримати список активних івентів
@api_view(["GET"])
def active_event_list(request):
    current_time = timezone.now()
    events = Event.objects.filter(end_date__gt=current_time)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

# Отримати список архівних івентів
@api_view(["GET"])
def archived_event_list(request):
    current_time = timezone.now()
    events = Event.objects.filter(end_date__lte=current_time)
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

# Пошук івентів
@api_view(["GET"])
def search_events(request):
    query = request.GET.get('q', '')
    
    if not query:
        return Response({"error": "Введіть пошуковий запит"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Параметр включення архівних івентів
    show_archived = request.GET.get('archived', 'false').lower() == 'true'
    current_time = timezone.now()
    
    # Базовий пошуковий запит (пошук по всіх полях)
    base_query = Q(title__icontains=query) | Q(description__icontains=query)
    
    # Фільтрація за типом пошуку
    search_type = request.GET.get('type', '')
    if search_type == 'title':
        base_query = Q(title__icontains=query)
    elif search_type == 'description':
        base_query = Q(description__icontains=query)
    
    # Застосування фільтрації за статусом (активний/архівний)
    if not show_archived:
        events = Event.objects.filter(base_query & Q(end_date__gt=current_time))
    else:
        events = Event.objects.filter(base_query)
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

# Реєстрація на івент
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_for_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Івент не знайдено"}, status=status.HTTP_404_NOT_FOUND)

    email = request.data.get("email")
    
    # Перевірка наявності email
    if not email:
        return Response({"error": "Вкажіть email"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Перевірка формату email
    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Вкажіть коректний email"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Перевірка чи івент не завершився
    if event.end_date < timezone.now():
        return Response({"error": "Реєстрація на цей івент закрита - івент вже завершився"}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    # Перевірка, чи користувач вже зареєстрований на цей івент
    if EventRegistration.objects.filter(event=event, user=request.user).exists():
        return Response({"error": "Ви вже зареєстровані на цей івент"}, status=status.HTTP_400_BAD_REQUEST)

    registration = EventRegistration.objects.create(event=event, user=request.user, email=email)

    # Відправка email
    # send_mail(
    #     subject=f"Реєстрація на {event.title}",
    #     message=f"Ви зареєструвались на івент {event.title}, який відбудеться {event.start_date}.",
    #     from_email="noreply.sigma@xcdto.xyz",
    #     recipient_list=[email],
    #     fail_silently=False,
    # )

    return Response({"message": "Ви успішно зареєстровані!", "registration_id": registration.id})

# Хто зарєестрований на івент
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request, user_id):
    try:
        user_to_update = User.objects.get(id=user_id)  # Користувач, якого оновлюємо
    except User.DoesNotExist:
        return Response({"error": "Користувача не знайдено"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    current_user = request.user  # Поточний користувач (той, хто робить запит)

    # Перевірка прав доступу
    if current_user.id != user_to_update.id and not current_user.is_staff:
        return Response({"error": "У вас немає прав для оновлення цього профілю"}, status=status.HTTP_403_FORBIDDEN)

    # Оновлення імені та прізвища (може робити користувач або адміністратор)
    if 'first_name' in data:
        user_to_update.first_name = data['first_name']
    if 'last_name' in data:
        user_to_update.last_name = data['last_name']

    # Оновлення паролю (може робити тільки власник профілю)
    if 'password' in data:
        if current_user.id != user_to_update.id:
            return Response({"error": "Ви не можете змінювати пароль іншого користувача"}, status=status.HTTP_403_FORBIDDEN)
        new_password = data['password']
        if new_password:  # Перевіряємо, чи новий пароль не є порожнім
            user_to_update.set_password(new_password)
        else:
            return Response({"error": "Пароль не може бути порожнім"}, status=status.HTTP_400_BAD_REQUEST)

    # Зберігаємо зміни
    user_to_update.save()

    # Повертаємо оновлені дані користувача
    response_data = {
        'user_id': user_to_update.id,
        'username': user_to_update.username,
        'first_name': user_to_update.first_name,
        'last_name': user_to_update.last_name,
        'message': 'Профіль успішно оновлено'
    }

    return Response(response_data)