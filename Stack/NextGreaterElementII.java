/*
LeetCode #503
Problem: Next Greater Element II
Difficulty: Medium
URL: https://leetcode.com/problems/next-greater-element-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int[] nextGreaterElements(int[] nums) {

        int[] res = new int[nums.length];

        for(int i =0;i<nums.length;i++){

            res[i] = -1;

            for(int j =1;j<nums.length;j++){

                int nextindex = (i+j)%nums.length;

                if(nums[i]<nums[nextindex]){

                    res[i] = nums[nextindex];
                    break;
                }

            }
        }

        return res;
        
    }
}
