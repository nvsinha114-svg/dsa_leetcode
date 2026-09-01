/*
LeetCode #203
Problem: Remove Linked List Elements
Difficulty: Easy
URL: https://leetcode.com/problems/remove-linked-list-elements/
Time Complexity: O(n)
Space Complexity: O(1)
*/

while(curr.next!=null){

             if(curr.val == val) {

                 curr.next = curr.next.next;
             }

             else curr = curr.next;
        }

        return dummy.next;
        
    }
}
