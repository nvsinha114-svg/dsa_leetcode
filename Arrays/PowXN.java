/*
LeetCode #50
Problem: Pow(x, n)
Difficulty: Medium
URL: https://leetcode.com/problems/powx-n/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public double myPow(double x, int n) {

        int N = n;

        if(N<0){

            x=1/x;
            N= -N;
        }

        return power(x,N);
        
    }

    public double power(double x , int n){

        if(n==0) return 1;

        double half = power(x,n/2);

        if(n%2==0) return half*half;

        return half*half*x;
    }
}
