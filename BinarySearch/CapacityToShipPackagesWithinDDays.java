/*
LeetCode #1011
Problem: Capacity To Ship Packages Within D Days
Difficulty: Medium
URL: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int shipWithinDays(int[] weights, int days) {

        int low = Integer.MIN_VALUE;

        for(int i =0;i<weights.length;i++){

            low = Math.max(weights[i],low);
        }

        int high = 0;

        for(int i=0;i<weights.length;i++){

            high+=weights[i];
        }

       
        while(low<=high){

             int requiredays  = 1;
             int sumweights = 0;


            int mid =low+(high-low)/2;
            
            for(int i =0;i<weights.length;i++){

                if(sumweights+weights[i] > mid){

                    requiredays++;
                    sumweights = 0;
                }

                sumweights+=weights[i];
            }

            if(requiredays<=days) high = mid-1;

            else low = mid+1;

        }

        return low;
        
    }
}
