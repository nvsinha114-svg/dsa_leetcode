/*
LeetCode #1011
Problem: Capacity To Ship Packages Within D Days
Difficulty: Medium
URL: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
Time Complexity: O(n)
Space Complexity: O(1)
*/

int high = 0;

        for(int i=0;i<weights.length;i++){

            high+=weights[i];
        }

       
        while(low<=high){

            low = Math.max(weights[i],low);
        }


             int requiredays  = 1;
             int sumweights = 0;


            int mid =low+(high-low)/2;
