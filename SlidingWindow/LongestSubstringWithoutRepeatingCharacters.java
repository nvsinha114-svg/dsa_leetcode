/*
LeetCode #3
Problem: Longest Substring Without Repeating Characters
Difficulty: Medium
URL: https://leetcode.com/problems/longest-substring-without-repeating-characters/
Time Complexity: O(n)
Space Complexity: O(1)
*/

char ch = s.charAt(right);

             while(set.contains(ch)){

                set.remove(s.charAt(left));
                left++;
             }
             set.add(ch);
             counter = Math.max(counter,right-left+1);
        }

        return counter;
        
    }
}
