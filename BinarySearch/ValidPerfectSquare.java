/*
LeetCode #367
Problem: Valid Perfect Square
Difficulty: Easy
URL: https://leetcode.com/problems/valid-perfect-square/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean isPerfectSquare(int num) {

        int lb =1;
        int rb = num;

        while(lb<=rb){

            int mid = lb+(rb-lb)/2;

            if((long)mid*mid == num) return true;

            else if((long)mid*mid>num) rb = mid-1;

            else lb = mid+1;
        }

        return false;
        
    }
}
