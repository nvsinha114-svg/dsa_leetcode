/*
LeetCode #19
Problem: Remove Nth Node From End of List
Difficulty: Medium
URL: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
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
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode temp = head;
        int cnt =0;
        while(temp!=null){
            temp = temp.next;
            cnt++;
        }
        int res =cnt-n;
        if(cnt==n) return head.next;
        ListNode temp1 =head;
        for(int i =1;i<res;i++){
            temp1 = temp1.next;
        }
        temp1.next = temp1.next.next;
        return head;
    }
}
