/*
LeetCode #234
Problem: Palindrome Linked List
Difficulty: Easy
URL: https://leetcode.com/problems/palindrome-linked-list/
Time Complexity: O(n)
Space Complexity: O(1)
*/

ListNode nextnode = current.next;
         while(current!=null){
             current.next =prev;
             prev = current;
             current =nextnode;
        }
           ListNode first = head;
           ListNode second = prev;

           while(second!=null){
            if(first.val!=second.val){
                return false;
            }
                first = first.next;
                second =second.next;
           }

           return true;
    }
