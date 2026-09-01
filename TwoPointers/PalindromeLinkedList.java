/*
LeetCode #234
Problem: Palindrome Linked List
Difficulty: Easy
URL: https://leetcode.com/problems/palindrome-linked-list/
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
    public boolean isPalindrome(ListNode head) {
        ListNode fast =head;
        ListNode slow = head;
        ListNode prev =null;
        while(fast!=null && fast.next!=null){
            slow =slow.next;
            fast=fast.next.next;
        }
         ListNode current =slow;
        
         while(current!=null){
            ListNode nextnode = current.next;
             current.next =prev;
             prev = current;
             current =nextnode;
        }
           ListNode first = head;
           ListNode second = prev;

           while(second!=null){
            
            if(first.val!=second.val){
                return false;
            }
                first = first.next;
                second =second.next;
           }

           return true;
    }
}
