/*
LeetCode #203
Problem: Remove Linked List Elements
Difficulty: Easy
URL: https://leetcode.com/problems/remove-linked-list-elements/
Time Complexity: O(n)
Space Complexity: O(1)
*/

while(curr.next!=null){
        ListNode curr = dummy;

        dummy.next = head;
        ListNode dummy = new ListNode(0);

    public ListNode removeElements(ListNode head, int val) {
class Solution {
 */
 * }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 *     ListNode(int val) { this.val = val; }
 *     ListNode next;
 *     ListNode() {}
 *     int val;

             if(curr.next.val == val) {

                 curr.next = curr.next.next;
             }
