/*
LeetCode #61
Problem: Rotate List
Difficulty: Medium
URL: https://leetcode.com/problems/rotate-list/
Time Complexity: O(n)
Space Complexity: O(1)
*/

for(int i=0;i<steps;i++){

            newtail = newtail.next;
        }

        ListNode newhead = newtail.next;

        newtail.next = null;

        return newhead;
    
        
    }
}
