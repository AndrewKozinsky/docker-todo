# Сервис для ведения заметок

Работающий проект находится на https://todo.editorium.net.

### Используемые технологии
Клиентская часть
- SCSS;
- React;
- Redux;
- Formic;
- Webpack;
- Babel

Серверная часть
- Node.js;
- MongoDB;
- Mongoose

Инфраструктура
- Docker;
- Nginx

### Запуск на локальном компьютере

1. В Консоле нужно перейти в папку, где будет проект
cd some/folder

2. Склонировать проект в эту папку
git clone https://github.com/AndrewKozinsky/docker-todo.git

3. Перейти в папку проекта
cd docker-todo

4. Запустить проект в Докере (перед этим не забудьте запустить Докер)

Для разработки:
- docker-compose -f docker-compose.dev.yml up --build

Для публикации:
- docker-compose -f docker-compose-prod.yml up --build

5. Проект можно запустить только на домене todo.local, поэтому на вашем локальном компьютере в файле hosts пропишите строку
127.0.0.1 todo.local

6. После проект можно открыть на todo.local 