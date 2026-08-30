/*
LeetCode #1
Problem: Two Sum
Difficulty: Easy
URL: https://leetcode.com/problems/two-sum/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int[] twoSum(int[] nums, int target) {

        HashMap<Integer,Integer> map = new HashMap<>();

        for(int i =0;i<nums.length;i++){
           
            int a =nums[i];

            int complement = target-a;

            if(map.containsKey(complement)){
           
             return new int[]{map.get(complement),i};
               
            }
            map.put(nums[i],i);
        }

        return new int[]{};
        
    }
}
