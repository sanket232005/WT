# 🚀 Express.js Beginner's Guide (for Dairy Manager)

Welcome! Express is a very popular, minimal framework built on top of Node.js. It exists to make it incredibly easy to start a web server and define "routes" (endpoints like `/api/records`) that your frontend can talk to.

Here is a breakdown of what exactly is happening inside your `server.js` file, in simple terms.

---

## 1. Importing the Tools
```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
```
* **`express`**: Our main web framework.
* **`fs`**: Stands for "File System". It is built into Node.js and allows us to read from and write to our `data.json` file on the hard drive.
* **`path`**: A helpful built-in tool to reliably find out where files are located on your specific computer.

## 2. Booting up the Server
```javascript
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
```
We create our actual application by running `express()` and call it `app`. We tell it to run on port `3000` (meaning you access it via `http://localhost:3000`). We also define exactly where our text-based database (`data.json`) will live.

## 3. The "Middleman" (Middleware)
```javascript
app.use(express.json());
app.use(express.static(__dirname)); 
```
Middleware are functions that intercept the request before it gets to your routes.
* **`express.json()`**: When your frontend sends data (like submitting a new Farmer Collection), it sends it in JSON format. This middleware magically translates that JSON into a normal JavaScript object that our server can read.
* **`express.static(__dirname)`**: This tells Express: *"If a user goes to `http://localhost:3000`, just serve all the static files (like `index.html`, `style.css`, and `script.js`) that are in this folder."*

## 4. Reading and Writing Data
Instead of using a bulky database system like SQL or MongoDB for such a simple project, we use `fs` (File System) to save your data directly in a plain text file (`data.json`).
* **`loadRecords()`**: Reads `data.json` and converts it into a Javascript array.
* **`saveRecords()`**: Takes your Javascript array and writes it back into `data.json`.

## 5. The API "Routes" (How the frontend talks to the backend)
Routes are basically the specific URLs the frontend uses to ask the server to do things (fetching, adding, deleting). 
In Express, they map to HTTP actions: `GET` (Give me data), `POST` (Save new data), `DELETE` (Remove data).

### **GET: Looking up records**
```javascript
app.get('/api/records', (req, res) => { ... })
```
When `script.js` wants to load the table when the page starts, it hits this route. The server calls `loadRecords()` and `res.json(records)` sends that data back to the browser.

### **POST: Saving a new record**
```javascript
app.post('/api/records', (req, res) => { ... })
```
When a user clicks "Add Collection", the frontend `script.js` sends the new milk details here. `req.body` contains the form data. The server adds an `id` and current `date`, pushes it into the array, and then runs `saveRecords()` to write it into `data.json`.

### **DELETE: Removing records**
```javascript
app.delete('/api/records/:id', (req, res) => { ... })
```
The `:id` is a variable in the URL. If the frontend says `DELETE /api/records/12345`, the server extracts `12345` from `req.params.id`. It filters that item out of the array and updates `data.json`.

## 6. Starting it up!
```javascript
app.listen(PORT, () => {
    console.log(`✅ Dairy Manager server running at http://localhost:${PORT}`);
});
```
This single block actually starts the engine. It listens continuously on port `3000` until you shut it down, handling requests as they come in.

---

### How they connect (`script.js` → `server.js`):
Before, `script.js` used `localStorage.setItem()`.
Now, `script.js` uses `fetch()`. 
```javascript
// Example of the frontend asking the backend to save data:
fetch('/api/records', { 
    method: 'POST', 
    body: JSON.stringify(recordData) 
})
```
1. `script.js` sends `fetch('/api/records')`.
2. `server.js` receives it on `app.post('/api/records')`.
3. `server.js` updates `data.json`.
4. `server.js` responds with success.
5. `script.js` updates the user interface.
