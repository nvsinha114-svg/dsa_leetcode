/*
LeetCode #540
Problem: Single Element in a Sorted Array
Difficulty: Medium
URL: https://leetcode.com/problems/single-element-in-a-sorted-array/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int singleNonDuplicate(int[] nums) {
        
      int low = 0;
      int high = nums.length-1;

      while(low<high){

        int mid = low+(high-low)/2;

        if(nums[mid]==nums[mid^1]) low = mid+1;

        else high = mid;
      }
        
        return nums[low];
        
    }
}
