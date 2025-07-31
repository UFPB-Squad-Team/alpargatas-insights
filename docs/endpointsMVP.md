# **API Endpoint Map (MVP)**

This document details all the API endpoints that will be built for the MVP of the "Alpargatas Insight" platform.

| Method | Endpoint               | Controller          | Corresponding Use Case    | Description                                                                |
| :----- | :--------------------- | :------------------ | :------------------------ | :------------------------------------------------------------------------- |
| GET    | /api/v1/dashboard/kpis | DashboardController | GetDashboardKPIsUseCase   | Returns the main indicators for the top dashboard cards.                   |
| GET    | /api/v1/dashboard/map  | DashboardController | ListSchoolsForMapUseCase  | Returns an optimized list of schools (ID, name, coords, risk) for the map. |
| GET    | /api/v1/schools/:id    | SchoolController    | GetSchoolDetailsUseCase   | Returns the complete data for a single school.                             |
| GET    | /api/v1/municipalities | DashboardController | ListMunicipalitiesUseCase | Returns a list of all municipalities (ID, name) for a dropdown filter.     |
| GET    | /api/v1/health         | DashboardController | (N/A)                     | Health check endpoint for container monitoring.                            |
