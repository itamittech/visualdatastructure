# Setup Guide - Visual Data Structure

This guide will help you set up and run the Visual Data Structure application.

## Prerequisites

### Frontend
- Node.js (version 16 or higher)
- npm or yarn

### Backend
- Java 17 or higher
- Maven 3.6 or higher

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd visualdatastructure
```

### 2. Backend Setup

Navigate to the backend directory and build the project:

```bash
cd backend
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

To verify the backend is running:
```bash
curl http://localhost:8080/api/health
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Project Structure

```
visualdatastructure/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (visualizers)
│   │   ├── services/        # API service layer
│   │   ├── styles/          # CSS files
│   │   └── main.jsx         # Application entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/visualds/
│   │               ├── controller/    # REST API controllers
│   │               ├── model/         # Data structure implementations
│   │               └── VisualDataStructureApplication.java
│   └── pom.xml
└── README.md
```

## Features

### Data Structures Implemented

#### 1. Array
- **Scratch Implementation**: Custom dynamic array with automatic resizing
- **Library Implementation**: Java's ArrayList
- **Operations**: Insert, Delete, Search, Access
- **Complexity**: All operations with time/space complexity analysis

#### 2. Linked List
- **Scratch Implementation**: Singly linked list with node-based structure
- **Library Implementation**: Java's LinkedList
- **Operations**: Insert at beginning/end/position, Delete, Search, Reverse
- **Complexity**: Detailed complexity for each operation

#### 3. Set
- **Scratch Implementation**: Hash set with separate chaining
- **Library Implementation**: Java's HashSet
- **Operations**: Add, Remove, Contains, Union, Intersection, Clear
- **Complexity**: Average and worst-case scenarios

### Visualization Features

- Interactive animations for all operations
- Real-time state updates
- Highlighted elements during operations
- Step-by-step execution feedback

### Code Display

- Side-by-side comparison of scratch vs library implementations
- Full Java source code for each data structure
- Copy-to-clipboard functionality
- Syntax highlighting

## API Endpoints

### Array Endpoints
- `POST /api/array/custom/create` - Create custom array
- `POST /api/array/library/create` - Create library array
- `POST /api/array/operations` - Perform array operations

### Linked List Endpoints
- `POST /api/linkedlist/custom/create` - Create custom linked list
- `POST /api/linkedlist/library/create` - Create library linked list
- `POST /api/linkedlist/operations` - Perform linked list operations

### Set Endpoints
- `POST /api/set/custom/create` - Create custom set
- `POST /api/set/library/create` - Create library set
- `POST /api/set/operations` - Perform set operations

### General Endpoints
- `GET /api/health` - Check API health
- `GET /api/info` - Get API information

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development

```bash
cd backend
mvn spring-boot:run           # Run application
mvn test                      # Run tests
mvn clean package             # Build JAR file
```

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend

```bash
cd backend
mvn clean package
```

The JAR file will be in `backend/target/visual-data-structure-1.0.0.jar`

Run the JAR:
```bash
java -jar backend/target/visual-data-structure-1.0.0.jar
```

## Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check if port 8080 is available
- Verify Maven is installed: `mvn -version`

### Frontend won't start
- Ensure Node.js 16+ is installed: `node -version`
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

### CORS Issues
- Ensure backend is running on port 8080
- Frontend should be on port 5173
- Check CORS configuration in `VisualDataStructureApplication.java`

## Next Steps

You can extend this project by adding more data structures:
- Stack
- Queue
- Binary Tree
- Graph
- Heap
- Hash Table with different collision resolution strategies

Each new data structure should follow the same pattern:
1. Create scratch implementation in `backend/src/main/java/com/visualds/model/`
2. Add API endpoints in `DataStructureController.java`
3. Create visualizer component in `frontend/src/pages/`
4. Add route in `App.jsx`
5. Update navigation and home page

## License

MIT License - Feel free to use this project for learning and education.
