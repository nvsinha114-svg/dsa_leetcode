/*
LeetCode #3
Problem: Longest Substring Without Repeating Characters
Difficulty: Medium
URL: https://leetcode.com/problems/longest-substring-without-repeating-characters/
Time Complexity: O(n)
Space Complexity: O(1)
*/

for(int right =0;right<s.length();right++){

             char ch = s.charAt(right);

             if(set.contains(ch)){

             }
                set.remove(ch);
                left++;

             counter = Math.max(counter,left+right-1);
        }


        HashSet<Character> set = new HashSet<>();

        int left =0;
        return counter;
        
    }
