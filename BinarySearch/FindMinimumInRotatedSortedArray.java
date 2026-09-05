/*
LeetCode #153
Problem: Find Minimum in Rotated Sorted Array
Difficulty: Medium
URL: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int findMin(int[] nums) {

      //  Arrays.sort(nums);

        //return nums[0];

        int low =0;
        int high = nums.length-1;
        
        while(low<high){

            int mid = low+(high-low)/2;

            if(nums[mid]>nums[high]) low =mid+1;

            else high = mid;
        }

        return nums[low];
        
    }
}
