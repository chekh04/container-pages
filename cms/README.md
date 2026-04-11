# Strapi (CMS)

## Поля типа **Container**

| Поле (API) | Тип | Обязательное | Назначение |
|------------|-----|--------------|------------|
| `containerName` | string | да | Имя на карточке и в боковом меню |
| `slug` | UID | да | URL: `/reference/container/[slug]` (генерация от `containerName`) |
| `containerDetailsPageTitle` | string | да | Заголовок H1 на детальной странице |
| `containerImage` | media (1 изображение) | да | Картинка карточки + OG |
| `insideLength` … `maxCargoWeight` | string | нет | Размеры (как в таблице: `12.024 m`, …) |
| `containerDescription` | **Blocks** (rich text) | нет | Description: заголовки, списки, ссылки |
| `figures` | **media** (много изображений) | нет | Раздел Figures — фото контейнеров |
| `usage` | **Blocks** | нет | Раздел Usage |
| `seoTitle` | string | да | `<title>` и OG |
| `seoDescription` | text | да | meta description |
| `learnMoreLabel` | string | нет | Текст на карточке (по умолчанию на сайте: Learn more) |

Все опубликованные контейнеры попадают в список и сайдбар; порядок на сайте — по **`containerName`** (A→Z).

После смены схемы перезапустите Strapi и **пересоздайте записи** (или выполните миграцию БД), если старые поля не совпадают.

### Списки в админке (Bulleted / Numbered «disabled»)

В редакторе **Blocks** кнопки маркированного и нумерованного списка в тулбаре **серые**, если выделение охватывает **несколько блоков** (несколько абзацев) — так устроен редактор: список можно применить только к тексту **внутри одного** абзаца.

Что сделать:

1. Кликните **внутрь одного абзаца** и выделите только его текст — тогда кнопки списков станут активны.
2. Либо откройте выпадающий список типа блока (слева от поля) и выберите **Bulleted list** / **Numbered list** — так создаётся новый блок-список.
3. Либо в начале строки введите `- `, `*` или `1.` и пробел — сработает быстрый ввод списка.

На **сайте** Next списки из Blocks уже отображаются (`StrapiBlocks` рендерит `list` / `list-item`).

## Первый запуск

1. Скопируйте `.env.example` в `.env` и замените секреты на случайные строки.
2. Из корня монорепо: `npm install` (или только здесь: `npm install`).
3. `npm run develop` из папки `apps/cms` или из корня: `npm run dev:cms`.
4. Откройте `http://localhost:1337/admin` и создайте администратора.
5. **Settings → Users & Permissions → Roles → Public** — для `container` включите `find` и `findOne`; для **Upload** — `find` (для картинок).
6. **Settings → API Tokens** — создайте токен только на чтение и вставьте в `apps/web/.env.local` как `STRAPI_API_TOKEN`.

### Не вижу запись на сайте Next

1. В Strapi у записи нажата **Publish** (не только Save), статус **Published**.
2. **Public** — права как выше.
3. В `apps/web/.env.local`: `STRAPI_URL=http://localhost:1337` (тот же хост/порт, где крутится Strapi). Если задан `STRAPI_API_TOKEN`, токен должен иметь право читать `container`.
4. Next кэширует ответ на ~60 с (ISR): подождите минуту или перезапустите `npm run dev` для веба.
5. Проверка API: `http://localhost:1337/api/containers?populate=*` — должен быть **200** и JSON с `data: [...]`. Если **404** — у типа контента должны быть `routes/`, `controllers/`, `services/`.

### Favicon 500 в логах Strapi

В корне `apps/cms` должен быть `favicon.png` (в репозитории есть минимальный файл).
