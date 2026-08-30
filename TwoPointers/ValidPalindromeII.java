/*
LeetCode #680
Problem: Valid Palindrome II
Difficulty: Easy
URL: https://leetcode.com/problems/valid-palindrome-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean validPalindrome(String s) {

        int left =0;
        int right = s.length()-1;

        while(left < right){
             
             if(s.charAt(left)!=s.charAt(right)){
                
              return ispalindrome(s,left+1,right) || ispalindrome(s,left,right-1);
             }

             left++;
             right--;
        }

        return true;
        
    }

    public boolean ispalindrome(String s, int left,int right){

         while(left < right){

             if(s.charAt(left)!=s.charAt(right)) return false;
             
             left++;
             right--;
         }
         return true;
    }
}
