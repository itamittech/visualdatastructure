package com.visualds.model;

import java.util.Arrays;

/**
 * Custom Array Implementation from Scratch
 * Demonstrates dynamic array with automatic resizing
 */
public class CustomArray<T> {
    private Object[] data;
    private int size;
    private int capacity;

    public CustomArray() {
        this(10);
    }

    public CustomArray(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data = new Object[capacity];
        this.size = 0;
    }

    /**
     * Access element by index - O(1)
     */
    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
        return (T) data[index];
    }

    /**
     * Set element at index - O(1)
     */
    public void set(int index, T element) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
        data[index] = element;
    }

    /**
     * Add element at end - O(1) amortized
     */
    public void add(T element) {
        if (size == capacity) {
            resize();
        }
        data[size++] = element;
    }

    /**
     * Insert element at specific index - O(n)
     * Need to shift all elements to the right
     */
    public void insert(int index, T element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
        if (size == capacity) {
            resize();
        }
        // Shift elements to the right
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        data[index] = element;
        size++;
    }

    /**
     * Remove element at index - O(n)
     * Need to shift all elements to the left
     */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
        T removed = (T) data[index];
        // Shift elements to the left
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        data[--size] = null;
        return removed;
    }

    /**
     * Search for element - O(n)
     * Linear search through all elements
     */
    public int indexOf(T element) {
        for (int i = 0; i < size; i++) {
            if (data[i] == null && element == null) {
                return i;
            }
            if (data[i] != null && data[i].equals(element)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Check if array contains element - O(n)
     */
    public boolean contains(T element) {
        return indexOf(element) != -1;
    }

    /**
     * Resize array when capacity is reached - O(n)
     */
    private void resize() {
        capacity *= 2;
        Object[] newData = new Object[capacity];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData;
    }

    public int size() {
        return size;
    }

    public int capacity() {
        return capacity;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public void clear() {
        Arrays.fill(data, 0, size, null);
        size = 0;
    }

    /**
     * Get all elements as array
     */
    @SuppressWarnings("unchecked")
    public T[] toArray() {
        return (T[]) Arrays.copyOf(data, size);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < size; i++) {
            sb.append(data[i]);
            if (i < size - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
