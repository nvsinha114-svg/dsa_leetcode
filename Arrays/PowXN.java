/*
LeetCode #50
Problem: Pow(x, n)
Difficulty: Medium
URL: https://leetcode.com/problems/powx-n/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public double myPow(double x, int n) {
        
    }

    public double power(double x , int n){

        if(n==0) return 1;


        int N = n;

        if(N<0){

        }
            x=1/x;
            N= -N;

        return power(x,N);
