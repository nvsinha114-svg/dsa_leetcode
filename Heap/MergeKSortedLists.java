/*
LeetCode #23
Problem: Merge k Sorted Lists
Difficulty: Hard
URL: https://leetcode.com/problems/merge-k-sorted-lists/
Time Complexity: O(n)
Space Complexity: O(1)
*/

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        
           PriorityQueue<ListNode> pq = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );

      
        for (ListNode node : lists) {
            if (node != null) {
                pq.offer(node);
            }
        }

        
        ListNode dummy = new ListNode(-1);
        ListNode temp = dummy;

        while (!pq.isEmpty()) {

           
            ListNode curr = pq.poll();

            temp.next = curr;
            temp = temp.next;

            if (curr.next != null) {
                pq.offer(curr.next);
            }
        }

        return dummy.next;

    }
}
