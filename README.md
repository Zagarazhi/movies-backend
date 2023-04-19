# Описание
Этот проект представляет собой сервер для работы с фильмами и персоналом

# Запуск
Для старта заполните [конфигурационный файл](.env). После этого запустите решение:
- Микросервис фильмов: npm run start:dev movies
- Микросервис информации: npm run start:dev info
- Микросервис парсера: npm run start:dev parser

# Пути
## movie
- GET "MOVIES_PORT"/movies/:id - получение информации по конкретному фильму
- GET "MOVIES_PORT"/movies/:id/videos - получение видео по фильму
- GET "MOVIES_PORT"/movies/:id/similar - получение массива похожих фильмов
Пример: localhost:3001/movies/1

## parser
- POST "PARSER_PORT"/parse/movie/:kinopoiskId - парсинг фильма с кинопоиска
Можете не запускать этот микросервис, все остальные микросервисы работают без него

## info
- GET "INFO_PORT"/info - получение списка фильмов
Пример: localhost:3003/info?countries=1,2&genres=1,2&order=year-ASC&type=FILM&page=2&limit=1&minRating=5.5&numRatings=100000
- countries=1,2 - фильтр по странам 1,2
- genres=1,2 - фильтр по жанрам 1, 2
- order=year-ASC - сортировка по годам по возрастанию
- type=FILM - фильтр только фильмы
- page=2 - вторая страница
- limit=1 - количество элементов на странице
- minRating=5.5 - рейтинг ОТ
- numRatings=100000 - число оценок ОТ