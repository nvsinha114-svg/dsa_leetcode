/*
LeetCode #24
Problem: Swap Nodes in Pairs
Difficulty: Medium
URL: https://leetcode.com/problems/swap-nodes-in-pairs/
Time Complexity: O(n)
Space Complexity: O(1)
*/

ListNode first = prev.next;
            ListNode second = first.next;

            first.next = second.next;
            second.next = first;
            first = second;

            prev = first;
        }

        return dummy.next;
        
    }
}
