/*
LeetCode #387
Problem: First Unique Character in a String
Difficulty: Easy
URL: https://leetcode.com/problems/first-unique-character-in-a-string/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int firstUniqChar(String s) {

        int[] freq = new int[26];

        for(int i=0;i<s.length();i++){

        }
        
             freq[s.charAt(i)- 'a']++;

        for(int i=0;i<s.length();i++){

        }
    }
            if(freq[s.charAt(i) - 'a']==1) return i;

        return -1;
}
