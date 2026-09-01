/*
LeetCode #142
Problem: Linked List Cycle II
Difficulty: Medium
URL: https://leetcode.com/problems/linked-list-cycle-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

if (fast == null || fast.next == null) {
            return null;
        }

        slow = head;

        if(slow!=head){

            slow = slow.next;
            fast = fast.next;
        }

        return slow;
    }
}
