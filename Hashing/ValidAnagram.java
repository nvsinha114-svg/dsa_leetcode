/*
LeetCode #242
Problem: Valid Anagram
Difficulty: Easy
URL: https://leetcode.com/problems/valid-anagram/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean isAnagram(String s, String t) {
        if(s.length()!=t.length()){
            return false;
        }
       
       int[] count = new int[26];

       for(int i=0 ;i<s.length();i++){

           count[s.charAt(i)-'a']++;
           count[t.charAt(i)-'a']--;
       }

       for(int i=0 ;i<count.length;i++){

           if(count[i]!=0) return false;
       }

       return true;
    }
}
