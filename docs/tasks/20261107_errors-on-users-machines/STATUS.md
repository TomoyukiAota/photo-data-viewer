# Errors on users' machines: status

Started on 2026-11-07. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Complete; verified locally.

- A photo whose GPS values are empty is shown with "Location data (latitude and
  longitude) is not available." and an empty map, as for a photo without GPS
  data. Before, the page went blank.
- An error in rendering the map shows "The map cannot be shown." in its place,
  and the photo and its data stay. An error anywhere else in rendering shows
  "Something went wrong, and this page cannot be shown." with a Reload button,
  instead of Next.js' "Application error" page.
- Errors nothing handled are recorded as `Unhandled Error` events (the fields are
  in the [plan](./PLAN.md#the-event)). From Photo Location Map's window they
  arrive there as `[PDV] Unhandled Error`, under the category `Photo Data Viewer`.
- The About page says that errors are collected.

## Resuming

Nothing is pending in this repository once the pull request is merged.

- Seeing the errors: the analytics backend stores the new event as it stores the
  others; showing it with the rest of the errors is work in that backend.
- Photo Location Map has the same coordinate check by truthiness, and loads
  Leaflet from a CDN, which fails offline; those are fixed in its own repository.
- When adding a part of the page that can fail on its own, such as another map,
  give it an `ErrorBoundary` with its own `name`, so that its errors are told
  apart.
