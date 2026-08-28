# Daria Anashina Portfolio — контекст проекта

Этот файл предназначен для передачи проекта в новый чат. Перед началом работы прочитай его полностью, затем проверь актуальное состояние Git и запусти сборку.

> **Актуальное состояние после refactor (приоритетнее старых разделов ниже).** Страница содержит Hero, Selected Works, Catalog, Experience, Award, About, Skills и Contact — фраза ниже о не реализованных секциях устарела. Источником всех project/catalog data служит `src/data/portfolio.ts`: `projects` содержит четыре выбранные работы, а `catalogWorks` — восемь catalog-работ (первые четыре выводятся из `projects`). UI не должен дублировать ссылки, изображения или Behance URL.

> **Interaction architecture.** `useHorizontalSwipe` — единый жест: вправо закрывает, влево открывает Behance, порог 30% ширины. Catalog принимает жест только от edge экрана; detail — с поверхности карточки, но не с gallery и controls. `useFirstOpenHint` + `SwipeGuide` показывают подсказку один раз за reload для каталога и для любого detail. `useBodyScrollLock` использует reference-counted body lock для loader, mobile menu и catalog; ручные присваивания `body.style.overflow` не добавлять.

> **Refactor rules.** DRY — данные, ссылки, swipe, onboarding и scroll-lock существуют в одном месте. SRP применяется прагматично: data отвечает за контент, hooks — за одно взаимодействие, components — за композицию. Не добавлять абстракцию для единственного простого случая. Detail остаётся локальным внутри project-card; fullscreen viewer — отдельный portal. Декоративные `::before` и texture layers обязательно `pointer-events: none`.

> **Проверка.** Минимум: 320/375/425/768/1024/1440, reduced motion, DROP Close/Behance, detail gallery и оба направления свайпа, catalog CTA/guide/swipes/scroll return. Перед коммитом: `npm run build` и `git diff --check`.

## 1. Что это за проект

Одностраничное портфолио Дарьи Анашиной на React + TypeScript + Vite. Визуальный язык: royal blue paper/cardboard texture, editorial collage, pixel-типографика, бумажные слои, тени и физические перекрытия.

Основные блоки страницы:

1. Hero: имя, Москва / 2026, «ПОРТ ФОЛИО», профессия, категории, CTA, Polaroid-фотография с котиком и collage работ.
2. Selected Works: четыре project-карточки в pinned stack-композиции.
3. Project detail: подробности выбранного проекта, галерея до пяти изображений, точки пагинации, fullscreen viewer, действия Close / Behance.

Дополнительные разделы реализованы: Catalog, Experience, Award, About, Skills и Contact.

## 2. Стек и команды

- React latest, TypeScript, Vite.
- Framer Motion — stack-анимация, раскрытие деталки, drag и переходы.
- React Icons — иконки навигации, соцсетей и Behance.
- Сборка: `npm run build`.
- Dev-сервер: `npm run dev`.
- Production preview: `npm run preview`.
- Перед коммитом: `npm run build` и `git diff --check`.

## 3. Структура исходников

```text
src/
  App.tsx                         # точка композиции приложения и глобальные состояния
  main.tsx                        # React mount + импорт src/styles.css
  data/portfolio.ts               # единые проекты, изображения, навигация и ссылки
  hooks/
    useCardAlignment.ts           # iPhone-safe выравнивание карточки перед открытием
    useHaptic.ts                  # haptic feedback на coarse pointer
    useMediaQuery.ts              # реактивный media query
    useBodyScrollLock.ts          # reference-counted блокировка body scroll
    useFirstOpenHint.ts           # одноразовые onboarding-подсказки за reload
    useHorizontalSwipe.ts         # общий swipe Close / Behance
  components/
    layout/
      SiteLoader.tsx
      SiteNavigation.tsx          # SiteNavigation, MobileMenuButton, CompactHeader
    hero/
      Hero.tsx
    selected-works/
      SelectedWorks.tsx
      StackStage.tsx
      StackProject.tsx             # основной state machine карточки и деталки
      ProjectPreview.tsx
    catalog/Catalog.tsx           # trigger и fullscreen catalog portal
    interaction/SwipeGuide.tsx    # общая подсказка жестов
    Container.tsx, Divider.tsx,
    PaperSurface.tsx, PixelLabel.tsx,
    SectionLabel.tsx                # существующие общие примитивы
  styles.css                       # только агрегатор CSS-слоёв
  styles/
    base.css                       # reset, tokens, типографика, примитивы
    hero.css                       # Hero, header, portrait, collage
    works.css                      # Selected Works и project colors
    stack.css                      # pinned stack и входящие карточки
    detail.css                     # деталка, галерея, drag indicators, viewer
    responsive.css                 # breakpoint-переопределения
```

## 4. Единый источник данных

Не добавляй ссылки и изображения повторно в компоненты. Используй `src/data/portfolio.ts`.

Экспортируются:

- `navigation` — пункты основного меню.
- `behanceUrl`, `telegramUrl`, `mailUrl`, `socialLinks`.
- `heroAssets` — изображения Hero.
- `projects` — четыре проекта с `className`, `index`, типом, заголовком, превью и `detail`.
- `preloadedImages` — список для стартового loader.

Индексы проектов: `0` Solar Adventures, `1` Театральная пьеса, `2` ROAM, `3` DROP. Не меняй индексы без проверки stack-таймлайна и цветов CSS.

## 5. Поведение Hero и навигации

- Hero-header находится в Hero.
- Compact header появляется после `window.scrollY > 67` и остаётся сверху при прокрутке.
- Mobile menu включается на текущих мобильных breakpoint-ах; не меняй классы `hero-navigation--open`, `compact-navigation--open`, если не меняешь CSS одновременно.
- Полароид — обычный прямоугольник, не rounded card. Котик позиционируется отдельным `.portrait-cat`.
- Hero collage использует реальные изображения из `images/`; это physical collage, а не grid.

## 6. Selected Works и выравнивание

`StackStage` связывает scroll progress с карточками через Framer Motion. Карточки 02–04 появляются снизу/из углов и накладываются на предыдущие.

Перед открытием деталки `StackProject` вызывает `snapTo` из `useCardAlignment`:

- вычисляет позицию через реальный DOM rect;
- учитывает `visualViewport` Safari;
- ждёт два последовательных стабильных кадра;
- делает финальную коррекцию при остаточном смещении;
- имеет timeout-защиту от бесконечного ожидания.

Не возвращай приблизительное открытие по таймеру до завершения snap. Повторное нажатие во время `ВЫРАВНИВАЕМ…` должно игнорироваться.

После успешного snap карточка фиксируется ровно (`isAlignmentLocked`). Это важно для iPhone и для возврата после закрытия деталки.

## 7. Project detail и жесты

Состояния деталки находятся в `StackProject`:

- закрыта;
- выравнивание (`isOpening`);
- открыта компактно;
- раскрыта (`detailExpanded`);
- drag по горизонтали на мобильном;
- closing / exit animation.

Правила:

- Галерея имеет независимый горизонтальный swipe и не должна запускать drag карточки.
- Вертикальный жест страницы не должен двигать detail-карточку.
- На мобильном горизонтальный drag использует pointer events и threshold 30% ширины.
- Свайп вправо — закрытие, красный индикатор с крестиком.
- Свайп влево — Behance, зелёный индикатор с иконкой Behance.
- Не добавляй `touch-action` или `preventDefault` на галерею так, чтобы сломать её горизонтальный swipe.
- Fullscreen viewer закрывается по кнопке, overlay и клику по изображению согласно текущему поведению.
- Сохраняй haptic feedback на coarse pointer.

## 8. CSS-правила

`src/styles.css` — агрегатор. Порядок импортов критичен:

1. base
2. hero
3. works
4. stack
5. detail
6. responsive

Существующие class names считаются API визуального слоя. Перед переименованием проверь все breakpoint-блоки. Для размеров, которые должны работать на всех viewport-ах, используй `clamp()`, но не меняй композицию без явного запроса.

Проверяй минимум: 320px, 375px, 425px, 768px, 1024px, 1440px и широкий desktop.

## 9. Безопасный workflow для нового чата

1. Прочитать этот файл.
2. Выполнить `git status --short`, не трогать пользовательские файлы и папку `правки` без запроса.
3. Найти нужную логику через `rg`.
4. Перед изменением описать, какие компоненты и CSS-слои затрагиваются.
5. Делать один логический этап за раз.
6. После каждого этапа выполнить сборку и `git diff --check`.
7. Каждый логический этап фиксировать отдельным локальным коммитом.
8. Не делать `git reset --hard`, force push или удаление файлов без явного подтверждения.
9. Не пушить в GitHub, пока пользователь явно не попросит.

## 10. Шаблон сообщения для нового чата

```text
Это React/Vite-портфолио Дарьи Анашиной.
Сначала прочитай PROJECT_CONTEXT.md и проверь git status.
Сохраняй текущую визуальную композицию, iPhone-safe выравнивание карточек,
stack-анимацию, drag-индикаторы, независимую галерею и fullscreen viewer.
Изменения делай по одному логическому этапу, после каждого запускай
npm run build и git diff --check, затем создавай отдельный локальный коммит.
Не пушь изменения без моего отдельного запроса.
Моя текущая задача: ...
```

## 11. История последних структурных коммитов

- `cc2fcb6` — данные портфолио и shared hooks.
- `d9d4600` — StackStage и StackProject.
- `7c3dd9b` — Hero, Selected Works и layout components.
- `a38a80e` — CSS по тематическим слоям.
- `c20f081` — reusable project detail building blocks.
- `80bc7c8` — сохранение Hero collage class names.
- `a0e6ec9` — использование media query hook в stack-карточках.
