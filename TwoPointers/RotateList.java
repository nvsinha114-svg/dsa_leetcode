/*
LeetCode #61
Problem: Rotate List
Difficulty: Medium
URL: https://leetcode.com/problems/rotate-list/
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
    public ListNode rotateRight(ListNode head, int k) {

        if (head == null || head.next == null || k == 0) {
            return head;
        }

        ListNode tail = head;
        int cnt =1;

        while(tail!=null && tail.next!=null){

            tail=tail.next;
            cnt++;
        }

        k = k%cnt;

        if(k==0) return head;

        tail.next = head;

        int steps = cnt-k-1;

        ListNode newtail = head;

        for(int i=0;i<steps;i++){

            newtail = newtail.next;
        }

        ListNode newhead = newtail.next;

        newtail.next = null;

        return newhead;
    
        
    }
}
