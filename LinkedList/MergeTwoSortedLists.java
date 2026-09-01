/*
LeetCode #21
Problem: Merge Two Sorted Lists
Difficulty: Easy
URL: https://leetcode.com/problems/merge-two-sorted-lists/
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
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

        ListNode head = new ListNode();
        ListNode temp = head;

        while(list1!=null && list2!=null){

            if(list1.val > list2.val){
                temp.next =list2;
                temp = temp.next;
                list2 = list2.next;
            }

            else {
                temp.next = list1;
                temp = temp.next;
                list1= list1.next;
            }
        }

        if(list1!=null) temp.next = list1;

        else temp.next = list2;

        return head.next;
        
    }
}
