/*
LeetCode #231
Problem: Power of Two
Difficulty: Easy
URL: https://leetcode.com/problems/power-of-two/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean isPowerOfTwo(int n) {
      if(n<=0)return false;
      return(n & n-1)==0;
    }
}
