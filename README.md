# Домашнее задание модуля "Расширенный инструментарий JavaScript в браузере"

## Тема: "WebWorkers and ServiceWorkers"

### WebWorkers + ServiceWorkers (Workbox) + Koa slow API

Что демонстрирует проект:

UI «скелетон» отображается сразу (даже офлайн) — статика кэшируется ServiceWorker’ом (Workbox).
Данные грузятся из Koa-сервера с искусственной задержкой.
При отсутствии соединения/ошибке запроса включается режим ошибки (оверлей).
WebWorker нормализует данные в фоне.

[![Deploy to GitHub Pages](https://github.com/SadliyVI/JSExtraWeb_HW_WebWorkers/actions/workflows/main.yml/badge.svg)](https://github.com/SadliyVI/JSExtraWeb_HW_WebWorkers/actions/workflows/main.yml)

## 🚀 Демо-онлайн

[Live demo front](https://sadliyvi.github.io/JSExtraWeb_HW_WebWorkers//)
