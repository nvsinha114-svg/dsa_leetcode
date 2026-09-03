/*
LeetCode #148
Problem: Sort List
Difficulty: Medium
URL: https://leetcode.com/problems/sort-list/
Time Complexity: O(n)
Space Complexity: O(1)
*/

temp.next = right;
                right = right.next;
            }

            temp = temp.next;
        }

        if(left != null)  temp.next = left;
        
        
        if(right != null)  temp.next = right;

        return dummy.next;
    }
}
