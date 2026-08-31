/*
LeetCode #424
Problem: Longest Repeating Character Replacement
Difficulty: Medium
URL: https://leetcode.com/problems/longest-repeating-character-replacement/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int characterReplacement(String s, int k) {

        int[] freq = new int[26];

        int left =0;
        int maxfreq =0;
        int maxlen =0;
      
        for(int right =0;right<s.length();right++){

            freq[s.charAt(right)-'A']++;

            maxfreq =Math.max(maxfreq, freq[s.charAt(right)-'A']);

            while((right-left+1)-maxfreq >k){
                   
                freq[s.charAt(left)-'A']--;   
                left++;
            }

            maxlen = Math.max(maxlen,right-left+1);
        }

        return maxlen;
        
    }
}
