/*
LeetCode #70
Problem: Climbing Stairs
Difficulty: Easy
URL: https://leetcode.com/problems/climbing-stairs/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int climbStairs(int n) {

        if(n<=2) return n;

        int prev2 =1;
        int prev1 =2;

        for(int i=3;i<=n;i++){

            int curr = prev1+prev2;

            prev2 = prev1;
            prev1 = curr;
        }

        return prev1;
        
    }
}
