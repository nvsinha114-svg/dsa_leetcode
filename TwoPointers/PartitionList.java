/*
LeetCode #86
Problem: Partition List
Difficulty: Medium
URL: https://leetcode.com/problems/partition-list/
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
    public ListNode partition(ListNode head, int x) {

        ListNode lessdummy = new ListNode(0);
        ListNode greaterdummy = new ListNode(0);

        ListNode less = lessdummy;
        ListNode greater = greaterdummy;

        while(head!=null){

            if(head.val<x){

                less.next = head;
                less = less.next;
            }

            else {

                greater.next = head;
                greater = greater.next;
            }
            head = head.next;
        }

        greater.next = null;
        less.next = greaterdummy.next;

        return lessdummy.next;
        
    }
}
