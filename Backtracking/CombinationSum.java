/*
LeetCode #39
Problem: Combination Sum
Difficulty: Medium
URL: https://leetcode.com/problems/combination-sum/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {

        List<List<Integer>> ans = new ArrayList<>();
        backtrack(candidates,0,target,new ArrayList<>(),ans);

        return ans;
        
    }
    public void backtrack(int[] candidates,int index,int target,List<Integer> current, List<List<Integer>> ans){

        if(target==0){

            ans.add(new ArrayList<>(current));
            return;
        }

        if(target < 0 || index == candidates.length) return;

        //LO
        current.add(candidates[index]);
        backtrack(candidates,index,target-candidates[index],current,ans);

        //BACKTRACK
        current.remove(current.size()-1);

        //MAT LO
        backtrack(candidates,index+1,target,current,ans);
    }
}
