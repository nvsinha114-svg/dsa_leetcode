/*
LeetCode #78
Problem: Subsets
Difficulty: Medium
URL: https://leetcode.com/problems/subsets/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public List<List<Integer>> subsets(int[] nums) {

        List<List<Integer>> ans = new ArrayList<>();

        backtrack(nums,0,new ArrayList<>(),ans);
        
        return ans;
        
    }

    public void backtrack(int[] nums,int index ,List<Integer> current,List<List<Integer>> ans){

        if(index==nums.length){

            ans.add(new ArrayList<>(current));
            return;
        }

        //lo
        current.add(nums[index]);
        backtrack(nums,index+1,current,ans);

        //backtrack
        current.remove(current.size()-1);

        //mat lo
        backtrack(nums,index+1,current,ans);

    }
}
