# Route Searcher

Поиск подходящих маршрутов

## Description
REST API для сгк. Все операции разбиты по тегам. Вот их описание:
order/route/user - оперции над заказами/маршрутами/пользователями 
специалист АХО/ответственный сотрудник/представитель транспортной компании/администратор
- содержат операции, которые могут делать соответствующие пользователи. 
Под ними расположены схемы заказов, маршрутов, пользователей.
**Термины, используемые ниже:**
Заказ - это структура данных, содержащая информацию о перевозке груза. В частности начальный и конечный пункт.
Маршрут - это структура данных, содержащая информацию о перевозке груза и некоторую дополнительную информацию. В частности маршрут состоит из списка заказов.
**Описание работы проекта:**
1. Ответственный сотрудник создаёт заказ. При желании он этот заказ может удалить.
2. Специалист ахо помимо редактирования, поиска и удаления заказов может также искать, создавать, редактировать и удалять маршруты.
  После создания заказа маршрут создаётся автоматически. Далее специалист ахо может объединить маршруты в один с помощью функции поиска похожих маршрутов.
3. Представитель транспортной компании может просмотреть информацию о маршруте.
4. Администратор может добавлять, удалять и редактировать пользователей.
**Команда для запуска**: docker-compose build && docker-compose up или docker-compose up.**
_Примечание: для пользователей есть две схемы, одна содержит все данные, другая только авторизационные_.

## Bugs
- При пустой базе данных не работает get all