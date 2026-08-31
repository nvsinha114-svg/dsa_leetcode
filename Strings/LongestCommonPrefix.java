/*
LeetCode #14
Problem: Longest Common Prefix
Difficulty: Easy
URL: https://leetcode.com/problems/longest-common-prefix/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public String longestCommonPrefix(String[] strs) {

            if (strs == null || strs.length == 0)
                  return "";

            String first = strs[0];

            for(int i=0;i<first.length();i++){

                char  ch = first.charAt(i);

                for(int j =0;j<strs.length;j++){

                    if(i==strs[j].length() || strs[j].charAt(i)!=ch){

                        return first.substring(0,i);
                    }
                }
            }

            return first;
        
    }
}
