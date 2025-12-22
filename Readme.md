
# Dynamic Portfolio Dashboard Backend

This backend serves as the API for the **Dynamic Portfolio Dashboard** project.It provides endpoints to fetch financial data for stocks, including:

- Current Market Price (CMP) from Yahoo Finance
- P/E Ratio and Latest Earnings (best-effort from Google Finance / mock)

The backend is built with **Node.js, Express.js, and TypeScript** and is used by the Next.js frontend.

---

## Features

The backend provides:

1. **Single Stock Price (CMP)**

   - Fetches current market price for a given stock.
   - Endpoint: `GET /cmp?symbol=<SYMBOL>`
2. **Bulk Stock Prices**

   - Fetches CMP for multiple stocks in a single request.
   - Endpoint: `POST /cmp/bulk`
3. **Google Finance Metrics**

   - Fetches **P/E Ratio** and **Latest Earnings** for a stock.
   - Endpoint: `GET /google?symbol=<SYMBOL>`
   - Returns `null` if unavailable.
4. **Error Handling**

   - Graceful responses when data is unavailable or invalid.
5. **CORS Support**

   - Allows requests from the configured frontend origin (`DASHBOARD_APP_ORIGIN`).
6. **Environment-Based Configuration**

   - `.env` file defines PORT, NODE_ENV, and frontend origin.
7. **Mock Data Support**

   - Can serve mock data for frontend development and testing.
8. **Extensible**

   - Easy to integrate real APIs or additional endpoints.

---

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=9000
NODE_ENV=development
DASHBOARD_APP_ORIGIN=http://localhost:3000
```
# Dynamic-Portfolio-Backend
# Dynamic-Portfolio-Backend
