# Описание
Этот проект представляет собой сервер для работы с фильмами и персоналом

# Запуск
Для старта заполните [конфигурационный файл](.env). Обратите внимание, что у фильмов и комментариев разные базы данных. После найстроки запустите решение:  
- pm2 start ecosystem.config.js  
(Но до этого нужно запустить хотя бы раз каждый микросервис)  
- Микросервис фильмов: npm run start:dev movie  
- Микросервис информации: npm run start:dev info  
- Микросервис парсера: npm run start:dev parser  
- Микросервис комментариев: npm run start:dev comment  
- Микросервис персонала: npm run start:dev person  
- Микросервис авторизации: npm run start:dev auth  
Чтобы остановать:  
- pm2 stop all  
Api swagger:  
- http://localhost:3001/api/ - api микросервиса фильмов
- http://localhost:3002/api/ - api микросервиса парсера
- http://localhost:3003/api/ - api микросервиса информации
- http://localhost:3004/api/ - api микросервиса комментариев
- http://localhost:3005/api/ - api микросервиса персон
- http://localhost:3006/api/ - api микросервиса авторизации

# Пути
## movie
- GET "MOVIES_PORT"/movies/:id - получение информации по конкретному фильму
- GET "MOVIES_PORT"/movies/:id/videos - получение видео по фильму
- GET "MOVIES_PORT"/movies/:id/similar - получение массива похожих фильмов  
- GET "MOVIES_PORT"/movies/filters/genres - получение массива жанров  
- GET "MOVIES_PORT"/movies/filters/countries - получение массива стран  
Пример: localhost:3001/movies/1  
- (ADMIN) PUT "MOVIES_PORT"/movies/update/genre - обновление жанра  
Структура:  
{  
    "id": 1,  
    "nameRu": "фантастика",  
    "nameEn": "fantastic"  
}  
- (ADMIN) PUT "MOVIES_PORT"/movies/update/country - обновление страны  
Структура:  
{  
    "id": 1,  
    "nameRu": "США",  
    "nameEn": "USA"  
}  
- (ADMIN) PUT "MOVIES_PORT"/movies/update/movie - обновление фильма  
Структура:  
{  
    "id": 1,  
    "nameRu": "Матрица",  
    "nameEn": "The Matrix"  
}  

## parser
- (ADMIN) POST "PARSER_PORT"/parse/movie/:kinopoiskId - парсинг фильма с кинопоиска  
Можете не запускать этот микросервис, все остальные микросервисы работают без него

## info
- GET "INFO_PORT"/info/person/:personId - получение пользователя со всеми его фильмами  
- GET "INFO_PORT"/info - получение списка фильмов  
Пример: localhost:3003/info?countries=1,2&genres=1,2&order=year-ASC&type=FILM&page=2&limit=1&minRating=5.5&numRatings=100000&years=1999-2003&actors=1,2&directors=1,2&staff=44&keywords=he ma  
- countries=1,2 - фильтр по странам 1,2
- genres=1,2 - фильтр по жанрам 1, 2
- order=year-ASC - сортировка по годам по возрастанию
- type=FILM - фильтр только фильмы
- page=2 - вторая страница
- limit=1 - количество элементов на странице
- minRating=5.5 - рейтинг ОТ
- numRatings=100000 - число оценок ОТ
- years=1999-2003 - фильтр по годам (если написать years=1999, то будут только фильмы 1999)
- actors=1,2 - фильтр по актерам  
- directors=1,2 - фильтр по режиссерам  
- staff=44 - фильтр по другому персоналу  
- keywords=he ma  - фильтр по ключем словам (содержащее введенную подстроку)

## comment
- GET "COMMENT_PORT"/comments/:movieId/tree - все комментарии к фильму в древовидном представлении
- GET "COMMENT_PORT"/comments/:movieId/flat - все комментарии к фильму в плоском представлении
- GET "COMMENT_PORT"/comments/:commentId/comment - получение конкретного комментария по его id
- (USER) POST "COMMENT_PORT"/comments/:movieId - создание нового комментария.  
Структура:  
{  
    "type": "POSITIVE" | "NEUTRAL" | "NEGATIVE",  
    "title": "test",  
    "description": "test",  
    "repliedOnComment": 666  
}  
Поле repliedOnComment - необязательное. При уставновке его значения на null будет считаться комментарием к фильму.  
- (USER) PUT "COMMENT_PORT"/comments/comment/:commentId - обновление комментария.  
Структура:  
{  
    "type": "POSITIVE" | "NEUTRAL" | "NEGATIVE",  
    "title": "test",  
    "description": "test"  
}  
Все поля являются необязательными.

## person
- GET "PERSON_PORT"/persons/all?keywords=киану&page=1&limit=10 - получение всего персонала по ключем словам  
- GET "PERSON_PORT"/persons/actors?keywords=киану&page=1&limit=1 - получение всех актеров  
- GET "PERSON_PORT"/persons/directors?keywords=киану&page=1&limit=1 - получение всех режиссеров  
- GET "PERSON_PORT"/persons/staff?page=1&limit=1 - получение всего остального персонала  
- GET "PERSON_PORT"/persons/:movieId - получение персонала по фильму  

## auth
- GET "AUTH_PORT"/auth/google - авторизация через гугл, возвращает access и resresh токены  
- GET "AUTH_PORT"/auth/vk - авторизация через вк, возвращает access и resresh токены  
- POST "AUTH_PORT"/auth/signup - регистрация  
Структура:  
{  
    "login": "admin",  
    "email": "admin@mail.ru",  
    "password": "admin"  
}  
- POST "AUTH_PORT"/signin - вход  
Структура:  
{  
    "login": "admin",  
    "email": "admin@mail.ru",  
    "password": "admin"  
}  
- (USER) GET "AUTH_PORT"/auth/logout - выход  
- (USER) GET "AUTH_PORT"/auth/refresh - обновить рефреш токен, возвращает access и resresh токены  
- (USER) GET "AUTH_PORT"/users/info - возвращает логин и почту текущего пользователя  
- (ADMIN) POST "AUTH_PORT"/roles - создает новую роль  
Структура:  
{  
    "value": "USER",  
    "description": "Простой и обычный"  
}  
- (ADMIN) GET "AUTH_PORT"/users/isadmin - возвращает true, если админ или 401