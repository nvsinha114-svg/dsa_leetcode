/*
LeetCode #704
Problem: Binary Search
Difficulty: Easy
URL: https://leetcode.com/problems/binary-search/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int search(int[] nums, int target) {
        int low =0;
        int high =nums.length-1;
        while(low<=high){
            int mid =(low+high)/2;
            if(nums[mid]==target){
                return mid;
            }
            else if(target<nums[mid]){
                high =mid-1;
            }
            else low =mid +1;
        }
        return -1;
    }
}
