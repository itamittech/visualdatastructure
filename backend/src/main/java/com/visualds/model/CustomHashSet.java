package com.visualds.model;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Custom Hash Set Implementation from Scratch
 * Uses separate chaining for collision resolution
 */
public class CustomHashSet<T> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    private LinkedList<T>[] buckets;
    private int size;
    private int capacity;

    @SuppressWarnings("unchecked")
    public CustomHashSet() {
        this.capacity = INITIAL_CAPACITY;
        this.buckets = new LinkedList[capacity];
        this.size = 0;
    }

    /**
     * Add element to set - O(1) average case
     * Returns false if element already exists (no duplicates)
     */
    public boolean add(T element) {
        if (contains(element)) {
            return false;  // No duplicates allowed
        }

        // Check if we need to resize
        if ((float) size / capacity > LOAD_FACTOR) {
            resize();
        }

        int index = getIndex(element);
        if (buckets[index] == null) {
            buckets[index] = new LinkedList<>();
        }
        buckets[index].add(element);
        size++;
        return true;
    }

    /**
     * Check if set contains element - O(1) average case
     */
    public boolean contains(T element) {
        int index = getIndex(element);
        if (buckets[index] == null) {
            return false;
        }
        return buckets[index].contains(element);
    }

    /**
     * Remove element from set - O(1) average case
     */
    public boolean remove(T element) {
        int index = getIndex(element);
        if (buckets[index] == null) {
            return false;
        }
        boolean removed = buckets[index].remove(element);
        if (removed) {
            size--;
            // Remove empty bucket
            if (buckets[index].isEmpty()) {
                buckets[index] = null;
            }
        }
        return removed;
    }

    /**
     * Union with another set - O(n + m)
     */
    public CustomHashSet<T> union(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();
        // Add all elements from this set
        for (T element : this.toList()) {
            result.add(element);
        }
        // Add all elements from other set
        for (T element : other.toList()) {
            result.add(element);
        }
        return result;
    }

    /**
     * Intersection with another set - O(min(n, m))
     */
    public CustomHashSet<T> intersection(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();
        // Iterate through smaller set
        CustomHashSet<T> smaller = this.size < other.size ? this : other;
        CustomHashSet<T> larger = this.size < other.size ? other : this;

        for (T element : smaller.toList()) {
            if (larger.contains(element)) {
                result.add(element);
            }
        }
        return result;
    }

    /**
     * Difference (elements in this set but not in other) - O(n)
     */
    public CustomHashSet<T> difference(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();
        for (T element : this.toList()) {
            if (!other.contains(element)) {
                result.add(element);
            }
        }
        return result;
    }

    /**
     * Check if this set is a subset of another - O(n)
     */
    public boolean isSubsetOf(CustomHashSet<T> other) {
        if (this.size > other.size) {
            return false;
        }
        for (T element : this.toList()) {
            if (!other.contains(element)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all elements as a list - O(n)
     */
    public List<T> toList() {
        List<T> result = new ArrayList<>();
        for (LinkedList<T> bucket : buckets) {
            if (bucket != null) {
                result.addAll(bucket);
            }
        }
        return result;
    }

    /**
     * Get bucket index for element
     */
    private int getIndex(T element) {
        return Math.abs(element.hashCode() % capacity);
    }

    /**
     * Resize when load factor is exceeded - O(n)
     */
    @SuppressWarnings("unchecked")
    private void resize() {
        capacity *= 2;
        LinkedList<T>[] oldBuckets = buckets;
        buckets = new LinkedList[capacity];
        size = 0;

        // Rehash all elements
        for (LinkedList<T> bucket : oldBuckets) {
            if (bucket != null) {
                for (T element : bucket) {
                    add(element);
                }
            }
        }
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

    @SuppressWarnings("unchecked")
    public void clear() {
        buckets = new LinkedList[capacity];
        size = 0;
    }

    @Override
    public String toString() {
        return toList().toString();
    }

    /**
     * Get statistics about the hash set
     */
    public String getStatistics() {
        int usedBuckets = 0;
        int maxChainLength = 0;

        for (LinkedList<T> bucket : buckets) {
            if (bucket != null && !bucket.isEmpty()) {
                usedBuckets++;
                maxChainLength = Math.max(maxChainLength, bucket.size());
            }
        }

        return String.format(
            "Size: %d, Capacity: %d, Load Factor: %.2f, Used Buckets: %d, Max Chain: %d",
            size, capacity, (float) size / capacity, usedBuckets, maxChainLength
        );
    }
}
