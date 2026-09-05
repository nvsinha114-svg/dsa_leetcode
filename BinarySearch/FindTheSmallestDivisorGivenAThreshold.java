/*
LeetCode #1283
Problem: Find the Smallest Divisor Given a Threshold
Difficulty: Medium
URL: https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int smallestDivisor(int[] nums, int threshold) {

        int low = 1;
        int high = Integer.MIN_VALUE;

        for(int i = 0;i<nums.length;i++){

            high = Math.max(nums[i],high);
        }

        while(low<=high){

            int mid = low + (high-low)/2;
            int sum = 0;

            for(int i =0 ;i<nums.length;i++){

                sum+=(nums[i]+mid-1)/mid;
            }

            if(sum<=threshold) high = mid-1;

            else low = mid+1;
        }

        return low;
        
    }
}
