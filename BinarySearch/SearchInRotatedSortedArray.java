/*
LeetCode #33
Problem: Search in Rotated Sorted Array
Difficulty: Medium
URL: https://leetcode.com/problems/search-in-rotated-sorted-array/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int search(int[] nums, int target) {

        int lb =0;
        int ub =nums.length-1;
        
        while(lb<=ub){

            int mid = lb+(ub-lb)/2;

            if(nums[mid]==target) return mid;

            if(nums[lb]<=nums[mid]){

            if(target>=nums[lb] && target<nums[mid])    ub = mid-1;      

                else lb = mid+1;

            }

            else {

                if(target>nums[mid] && target<=nums[ub]) lb =mid+1;
                
                else ub =mid-1;
            }
        }

        return -1;
        
    }
}
