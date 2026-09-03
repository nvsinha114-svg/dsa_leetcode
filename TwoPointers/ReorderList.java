/*
LeetCode #143
Problem: Reorder List
Difficulty: Medium
URL: https://leetcode.com/problems/reorder-list/
Time Complexity: O(n)
Space Complexity: O(1)
*/

ListNode second = prev;

        while(second!=null){

            ListNode firstNext = first.next;
            ListNode secondNext = second.next;

            first.next = second;
            second.next = firstNext;

            first = firstNext;
            second = secondNext;
        }
        
    }
}
