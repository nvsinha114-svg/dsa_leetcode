/*
LeetCode #34
Problem: Find First and Last Position of Element in Sorted Array
Difficulty: Medium
URL: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int[] searchRange(int[] nums, int target) {

        int low = 0;
        int high = nums.length-1;

        int[] ans ={-1,-1};

        while(low<=high){

            int mid = low+(high-low)/2;

            if(nums[mid]==target){

                ans[0] = mid;
                high = mid-1;
            }

            else if(nums[mid]<target) low = mid+1;

            else high = mid-1;
        }

         low =0;
         high  = nums.length-1;

        while(low<=high){

            int mid = low+(high-low)/2;

            if(nums[mid]==target) {

                ans[1] = mid;
                low = mid+1;
            }

            else if(nums[mid]>target) high = mid-1;

            else low = mid+1;
        }

        return ans;
        
    }
}
