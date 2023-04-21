# Описание
Этот проект представляет собой сервер для работы с фильмами и персоналом

# Запуск
Для старта заполните [конфигурационный файл](.env). Обратите внимание, что у фильмов и комментариев разные базы данных. После найстроки запустите решение:
- Микросервис фильмов: npm run start:dev movie
- Микросервис информации: npm run start:dev info
- Микросервис парсера: npm run start:dev parser
- Микросервис комментариев: npm run start:dev comment

# Пути
## movie
- GET "MOVIES_PORT"/movies/:id - получение информации по конкретному фильму
- GET "MOVIES_PORT"/movies/:id/videos - получение видео по фильму
- GET "MOVIES_PORT"/movies/:id/similar - получение массива похожих фильмов  
- GET "MOVIES_PORT"/movies/filters/genres - получение массива жанров  
- GET "MOVIES_PORT"/movies/filters/countries - получение массива стран  
Пример: localhost:3001/movies/1

## parser
- POST "PARSER_PORT"/parse/movie/:kinopoiskId - парсинг фильма с кинопоиска  
Можете не запускать этот микросервис, все остальные микросервисы работают без него

## info
- GET "INFO_PORT"/info - получение списка фильмов  
Пример: localhost:3003/info?countries=1,2&genres=1,2&order=year-ASC&type=FILM&page=2&limit=1&minRating=5.5&numRatings=100000&years=1999-2003  
- countries=1,2 - фильтр по странам 1,2
- genres=1,2 - фильтр по жанрам 1, 2
- order=year-ASC - сортировка по годам по возрастанию
- type=FILM - фильтр только фильмы
- page=2 - вторая страница
- limit=1 - количество элементов на странице
- minRating=5.5 - рейтинг ОТ
- numRatings=100000 - число оценок ОТ
- years=1999-2003 - фильтр по годам (если написать years=1999, то будут только фильмы 1999)

## comment
- GET "COMMENT_PORT"/comments/:movieId/tree - все комментарии к фильму в древовидном представлении
- GET "COMMENT_PORT"/comments/:movieId/flat - все комментарии к фильму в плоском представлении
- GET "COMMENT_PORT"/comments/:commentId/comment - получение конкретного комментария по его id
- POST "COMMENT_PORT"/comments/:movieId - создание нового комментария.  
Структура:  
{  
    "type": "POSITIVE" | "NEUTRAL" | "NEGATIVE",  
    "title": "test",  
    "description": "test",  
    "repliedOnComment": 666  
}  
Поле repliedOnComment - необязательное. При уставновке его значения на null будет считаться комментарием к фильму.  
- PUT "COMMENT_PORT"/comments/comment/:commentId - обновление комментария.  
Структура:  
{  
    "type": "POSITIVE" | "NEUTRAL" | "NEGATIVE",  
    "title": "test",  
    "description": "test"  
}  
Все поля являются необязательными.