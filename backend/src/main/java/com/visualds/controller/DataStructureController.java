package com.visualds.controller;

import com.visualds.model.CustomArray;
import com.visualds.model.CustomLinkedList;
import com.visualds.model.CustomHashSet;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller for Data Structure operations
 * Demonstrates both custom implementations and Java library implementations
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DataStructureController {

    // ==================== ARRAY ENDPOINTS ====================

    @PostMapping("/array/custom/create")
    public Map<String, Object> createCustomArray(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        CustomArray<Integer> array = new CustomArray<>();
        if (elements != null) {
            for (Integer element : elements) {
                array.add(element);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "custom");
        response.put("elements", Arrays.asList(array.toArray()));
        response.put("size", array.size());
        response.put("capacity", array.capacity());
        return response;
    }

    @PostMapping("/array/library/create")
    public Map<String, Object> createLibraryArray(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        ArrayList<Integer> array = new ArrayList<>();
        if (elements != null) {
            array.addAll(elements);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "library");
        response.put("elements", array);
        response.put("size", array.size());
        return response;
    }

    @PostMapping("/array/operations")
    public Map<String, Object> arrayOperations(@RequestBody Map<String, Object> request) {
        String operation = (String) request.get("operation");
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");
        Integer value = (Integer) request.get("value");
        Integer index = (Integer) request.get("index");
        String implementation = (String) request.getOrDefault("implementation", "custom");

        Map<String, Object> response = new HashMap<>();

        try {
            if ("custom".equals(implementation)) {
                CustomArray<Integer> array = new CustomArray<>();
                if (elements != null) {
                    for (Integer element : elements) {
                        array.add(element);
                    }
                }

                switch (operation) {
                    case "insert":
                        array.insert(index, value);
                        response.put("message", "Inserted " + value + " at index " + index);
                        break;
                    case "delete":
                        Integer removed = array.remove(index);
                        response.put("message", "Deleted " + removed + " at index " + index);
                        break;
                    case "search":
                        int foundIndex = array.indexOf(value);
                        response.put("foundIndex", foundIndex);
                        response.put("message", foundIndex >= 0 ?
                            "Found " + value + " at index " + foundIndex :
                            value + " not found");
                        break;
                    case "access":
                        Integer accessed = array.get(index);
                        response.put("value", accessed);
                        response.put("message", "Value at index " + index + " is " + accessed);
                        break;
                }

                response.put("elements", Arrays.asList(array.toArray()));
                response.put("size", array.size());
            }

            response.put("success", true);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }

    // ==================== LINKED LIST ENDPOINTS ====================

    @PostMapping("/linkedlist/custom/create")
    public Map<String, Object> createCustomLinkedList(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        CustomLinkedList<Integer> list = new CustomLinkedList<>();
        if (elements != null) {
            for (Integer element : elements) {
                list.insertAtEnd(element);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "custom");
        response.put("elements", list.toList());
        response.put("size", list.size());
        return response;
    }

    @PostMapping("/linkedlist/library/create")
    public Map<String, Object> createLibraryLinkedList(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        LinkedList<Integer> list = new LinkedList<>();
        if (elements != null) {
            list.addAll(elements);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "library");
        response.put("elements", list);
        response.put("size", list.size());
        return response;
    }

    @PostMapping("/linkedlist/operations")
    public Map<String, Object> linkedListOperations(@RequestBody Map<String, Object> request) {
        String operation = (String) request.get("operation");
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");
        Integer value = (Integer) request.get("value");
        Integer position = (Integer) request.get("position");

        Map<String, Object> response = new HashMap<>();

        try {
            CustomLinkedList<Integer> list = new CustomLinkedList<>();
            if (elements != null) {
                for (Integer element : elements) {
                    list.insertAtEnd(element);
                }
            }

            switch (operation) {
                case "insertBeginning":
                    list.insertAtBeginning(value);
                    response.put("message", "Inserted " + value + " at beginning");
                    break;
                case "insertEnd":
                    list.insertAtEnd(value);
                    response.put("message", "Inserted " + value + " at end");
                    break;
                case "insertPosition":
                    list.insertAtPosition(value, position);
                    response.put("message", "Inserted " + value + " at position " + position);
                    break;
                case "delete":
                    boolean deleted = list.delete(value);
                    response.put("message", deleted ?
                        "Deleted " + value :
                        value + " not found");
                    break;
                case "search":
                    int foundIndex = list.indexOf(value);
                    response.put("foundIndex", foundIndex);
                    response.put("message", foundIndex >= 0 ?
                        "Found " + value + " at position " + foundIndex :
                        value + " not found");
                    break;
                case "reverse":
                    list.reverse();
                    response.put("message", "List reversed");
                    break;
            }

            response.put("elements", list.toList());
            response.put("size", list.size());
            response.put("success", true);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }

    // ==================== SET ENDPOINTS ====================

    @PostMapping("/set/custom/create")
    public Map<String, Object> createCustomSet(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        CustomHashSet<Integer> set = new CustomHashSet<>();
        if (elements != null) {
            for (Integer element : elements) {
                set.add(element);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "custom");
        response.put("elements", set.toList());
        response.put("size", set.size());
        response.put("statistics", set.getStatistics());
        return response;
    }

    @PostMapping("/set/library/create")
    public Map<String, Object> createLibrarySet(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");

        HashSet<Integer> set = new HashSet<>();
        if (elements != null) {
            set.addAll(elements);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", "library");
        response.put("elements", new ArrayList<>(set));
        response.put("size", set.size());
        return response;
    }

    @PostMapping("/set/operations")
    public Map<String, Object> setOperations(@RequestBody Map<String, Object> request) {
        String operation = (String) request.get("operation");
        @SuppressWarnings("unchecked")
        List<Integer> elements = (List<Integer>) request.get("elements");
        Integer value = (Integer) request.get("value");
        @SuppressWarnings("unchecked")
        List<Integer> otherElements = (List<Integer>) request.get("otherElements");

        Map<String, Object> response = new HashMap<>();

        try {
            CustomHashSet<Integer> set = new CustomHashSet<>();
            if (elements != null) {
                for (Integer element : elements) {
                    set.add(element);
                }
            }

            switch (operation) {
                case "add":
                    boolean added = set.add(value);
                    response.put("message", added ?
                        "Added " + value :
                        value + " already exists (no duplicates)");
                    break;
                case "remove":
                    boolean removed = set.remove(value);
                    response.put("message", removed ?
                        "Removed " + value :
                        value + " not found");
                    break;
                case "contains":
                    boolean contains = set.contains(value);
                    response.put("contains", contains);
                    response.put("message", contains ?
                        value + " exists in set" :
                        value + " not found");
                    break;
                case "union":
                    CustomHashSet<Integer> otherSet = new CustomHashSet<>();
                    if (otherElements != null) {
                        for (Integer element : otherElements) {
                            otherSet.add(element);
                        }
                    }
                    set = set.union(otherSet);
                    response.put("message", "Union performed");
                    break;
                case "intersection":
                    CustomHashSet<Integer> otherSet2 = new CustomHashSet<>();
                    if (otherElements != null) {
                        for (Integer element : otherElements) {
                            otherSet2.add(element);
                        }
                    }
                    set = set.intersection(otherSet2);
                    response.put("message", "Intersection performed");
                    break;
                case "clear":
                    set.clear();
                    response.put("message", "Set cleared");
                    break;
            }

            response.put("elements", set.toList());
            response.put("size", set.size());
            response.put("success", true);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }

    // ==================== GENERAL ENDPOINTS ====================

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Visual Data Structure API is running");
        return response;
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "Visual Data Structure API");
        response.put("version", "1.0.0");
        response.put("dataStructures", Arrays.asList("Array", "LinkedList", "Set"));
        response.put("implementations", Arrays.asList("Custom (from scratch)", "Java Library"));
        return response;
    }
}
