# Visual Data Structure

A comprehensive data structure visualization platform with React frontend and Java Spring Boot backend.

## Features

- Interactive visualization of common data structures
- Operations: Insert, Delete, Search, Update
- Time and Space complexity analysis
- Both scratch implementations and library-provided implementations
- Real-time animation of operations

## Data Structures

- Array
- Linked List
- Set
- (More to be added)

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Flow (for visualization)

### Backend
- Java 17
- Spring Boot 3.x
- Maven

## Project Structure

```
visualdatastructure/
├── frontend/          # React application
├── backend/           # Spring Boot application
└── README.md
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

The backend API will run on http://localhost:8080

## API Endpoints

- `POST /api/array/create` - Create a new array
- `POST /api/array/insert` - Insert element
- `GET /api/array/{id}` - Get array state
- `POST /api/linkedlist/create` - Create a new linked list
- `POST /api/linkedlist/insert` - Insert element
- `GET /api/linkedlist/{id}` - Get linked list state
- `POST /api/set/create` - Create a new set
- `POST /api/set/add` - Add element to set
- `GET /api/set/{id}` - Get set state

## License

MIT
