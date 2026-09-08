/*
LeetCode #90
Problem: Subsets II
Difficulty: Medium
URL: https://leetcode.com/problems/subsets-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

}

        if(index == nums.length){

            ans.add(new ArrayList<>(current));
            return;
        List<List<Integer>> ans = new ArrayList<>();
        backtrack(nums,0,new ArrayList<>(),ans);

        return ans;
        
    }

    public void backtrack(int[] nums, int index, List<Integer> current, List<List<Integer>> ans){
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {


        Arrays.sort(nums);
